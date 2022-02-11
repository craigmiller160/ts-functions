/* eslint-disable no-console */
import spawn from 'cross-spawn';
import path from 'path';
import { flow, pipe } from 'fp-ts/function';
import * as File from '../src/File';
import * as Either from 'fp-ts/Either';
import { match } from 'ts-pattern';
import * as RArr from 'fp-ts/ReadonlyArray';
import * as Text from '../src/Text';
import * as Regex from '../src/Regex';
import * as Option from 'fp-ts/Option';
import * as Json from '../src/Json';
import immer from 'immer';
import { TryT, IOTryT, MonoidT } from '../src/types';
import * as IOEither from 'fp-ts/IOEither';
import * as Monoid from 'fp-ts/Monoid';

interface PackageJson {
	scripts: {
		prepare?: string;
	};
}

interface FpTsGroups {
	readonly importName: string;
	readonly fileName: string;
}

interface FileHolder {
	readonly filePath: string;
	readonly fileContent: string;
}

const FP_TS_REGEX = /^(?<importName>.*)'fp-ts\/(?<fileName>.*)';$/;
const LIB_PATH = path.join(process.cwd(), 'lib');
const ES_LIB_PATH = path.join(LIB_PATH, 'es');
const PACKAGE_JSON_PATH = path.join(process.cwd(), 'package.json');
const PACKAGE_JSON_LIB_PATH = path.join(LIB_PATH, 'package.json');

const captureFpTsGroups = Regex.capture<FpTsGroups>(FP_TS_REGEX);
const concatWithNewline: MonoidT<string> = {
	empty: '',
	concat: Text.concat('\n')
};
const rmDirectoryIfExists = File.rmIfExistsSyncWithOptions({
	recursive: true,
	force: true
});

const runCommand = (command: string): IOTryT<string> => {
	console.log(`Command: ${command}`);
	const result = spawn.sync('bash', ['-c', command], {
		stdio: 'inherit'
	});
	return match(result)
		.with({ status: 0 }, () => IOEither.right(command))
		.otherwise(() =>
			IOEither.left(new Error(`Command failed: ${command}`))
		);
};

const fixImportIfPresent = (line: string): string =>
	pipe(
		captureFpTsGroups(line),
		Option.fold(
			() => line,
			(groups) => `${groups.importName}'fp-ts/es6/${groups.fileName}'`
		)
	);

const fixImportsInFile = (fileContent: string): string =>
	pipe(
		fileContent,
		Text.split('\n'),
		RArr.map(fixImportIfPresent),
		Monoid.concatAll(concatWithNewline)
	);

const readFileAndfixImports = (file: string): IOTryT<FileHolder> => {
	const fullFilePath = path.join(ES_LIB_PATH, file);
	return pipe(
		File.readFileSync(fullFilePath),
		IOEither.map(fixImportsInFile),
		IOEither.map(
			(content): FileHolder => ({
				filePath: fullFilePath,
				fileContent: content
			})
		)
	);
};

const writeFile = (fileHolder: FileHolder): IOTryT<void> =>
	File.writeFileSync(fileHolder.filePath)(fileHolder.fileContent);

const fixEsImports = (): IOTryT<ReadonlyArray<void>> => {
	console.log('Fixing ES Imports');

	return pipe(
		File.listFilesSync(ES_LIB_PATH),
		IOEither.chain(
			flow(RArr.map(readFileAndfixImports), IOEither.sequenceArray)
		),
		IOEither.chain(flow(RArr.map(writeFile), IOEither.sequenceArray))
	);
};

const buildProject = (): IOTryT<string> =>
	pipe(
		rmDirectoryIfExists(LIB_PATH),
		IOEither.chain(() => runCommand('tsc')),
		IOEither.chain(() => runCommand('tsc -p tsconfig.esmodule.json'))
	);

const updatePackageJson = (packageJsonString: string): TryT<string> =>
	pipe(
		Json.parseE<PackageJson>(packageJsonString),
		Either.map((_) =>
			immer(_, (draft) => {
				delete draft.scripts.prepare;
			})
		),
		Either.chain((_) => Json.stringifyE(_, 2))
	);

const copyPackageJson = (): IOTryT<void> =>
	pipe(
		File.readFileSync(PACKAGE_JSON_PATH),
		IOEither.chainEitherK(updatePackageJson),
		IOEither.chain(File.writeFileSync(PACKAGE_JSON_LIB_PATH))
	);

pipe(
	buildProject(),
	IOEither.chain(fixEsImports),
	IOEither.chain(copyPackageJson),
	IOEither.fold(
		(ex) => {
			console.error('Critical error in build', ex);
			process.exit(1);
		},
		() => {
			console.log('Build completed successfully');
			process.exit(0);
		}
	)
)();
