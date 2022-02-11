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
import { TryT } from '../src/types';
import { getCwd } from './getCwd';

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
const LIB_PATH = path.join(getCwd(), 'lib');
const ES_LIB_PATH = path.join(LIB_PATH, 'es');
const PACKAGE_JSON_PATH = path.join(getCwd(), 'package.json');
const PACKAGE_JSON_LIB_PATH = path.join(LIB_PATH, 'package.json');

const captureFpTsGroups = Regex.capture<FpTsGroups>(FP_TS_REGEX);
const concatWithNewline = Text.concat('\n');

const runCommand = (command: string): TryT<string> => {
	console.log(`Command: ${command}`);
	const result = spawn.sync('bash', ['-c', command], {
		stdio: 'inherit'
	});
	return match(result)
		.with({ status: 0 }, () => Either.right(command))
		.otherwise(() => Either.left(new Error(`Command failed: ${command}`)));
};

const fixImportIfPresent = (line: string): string =>
	pipe(
		captureFpTsGroups(line),
		Option.fold(
			() => line,
			(groups) => `${groups.importName}'fp-ts/es6/${groups.fileName}'`
		)
	);

const fixImportsInFile = (file: string): TryT<FileHolder> => {
	const fullFilePath = path.join(ES_LIB_PATH, file);
	return pipe(
		File.readFileSync(fullFilePath),
		Either.map(
			flow(
				Text.split('\n'),
				RArr.map(fixImportIfPresent),
				RArr.reduce('', concatWithNewline)
			)
		),
		Either.map(
			(content): FileHolder => ({
				filePath: fullFilePath,
				fileContent: content
			})
		)
	);
};

const writeFile = (fileHolder: FileHolder): TryT<void> =>
	File.writeFileSync(fileHolder.filePath, fileHolder.fileContent);

const fixEsImports = (): TryT<ReadonlyArray<void>> => {
	console.log('Fixing ES Imports');

	return pipe(
		File.listFilesSync(ES_LIB_PATH),
		Either.chain(flow(RArr.map(fixImportsInFile), Either.sequenceArray)),
		Either.chain(flow(RArr.map(writeFile), Either.sequenceArray))
	);
};

const buildProject = (): TryT<string> =>
	pipe(
		File.rmIfExistsSync(LIB_PATH),
		Either.chain(() => runCommand('tsc')),
		Either.chain(() => runCommand('tsc -p tsconfig.esmodule.json'))
	);

const copyPackageJson = (): TryT<void> =>
	pipe(
		File.readFileSync(PACKAGE_JSON_PATH),
		Either.chain((_) => Json.parse<PackageJson>(_)),
		Either.map((_) =>
			immer(_, (draft) => {
				delete draft.scripts.prepare;
			})
		),
		Either.chain((_) => Json.stringify(_, 2)),
		Either.chain((_) => File.writeFileSync(PACKAGE_JSON_LIB_PATH, _))
	);

pipe(
	buildProject(),
	Either.chain(fixEsImports),
	Either.chain(copyPackageJson),
	Either.fold(
		(ex) => {
			console.error('Critical error in build', ex);
			process.exit(1);
		},
		() => {
			console.log('Build completed successfully');
			process.exit(0);
		}
	)
);
