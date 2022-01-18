/* eslint-disable no-console */
import spawn from 'cross-spawn';
import path from 'path';
import { flow, pipe } from 'fp-ts/function';
import * as File from '../src/File';
import * as Try from '../src/Try';
import * as Either from 'fp-ts/Either';
import { match } from 'ts-pattern';
import * as Arr from 'fp-ts/Array';
import * as RArr from 'fp-ts/ReadonlyArray';
import * as Text from '../src/Text';
import * as Regex from '../src/Regex';
import * as Option from 'fp-ts/Option';
import * as Json from '../src/Json';

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
const concatWithNewline = Text.concat('\n');

const runCommand = (command: string): Try.Try<string> => {
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

const fixImportsInFile = (file: string): Try.Try<FileHolder> => {
	const fullFilePath = path.join(ES_LIB_PATH, file);
	return pipe(
		File.readFileSync(fullFilePath),
		Either.map(
			flow(
				Text.split('\n'),
				Arr.map(fixImportIfPresent),
				Arr.reduce('', concatWithNewline)
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

const writeFile = (fileHolder: FileHolder): Try.Try<void> =>
	File.writeFileSync(fileHolder.filePath, fileHolder.fileContent);

const fixEsImports = (): Try.Try<ReadonlyArray<void>> => {
	console.log('Fixing ES Imports');

	return pipe(
		File.listFilesSync(ES_LIB_PATH),
		Either.chain(flow(Arr.map(fixImportsInFile), Either.sequenceArray)),
		Either.chain(flow(RArr.map(writeFile), Either.sequenceArray))
	);
};

const buildProject = (): Try.Try<string> =>
	pipe(
		File.rmIfExistsSync(LIB_PATH),
		Either.chain(() => runCommand('tsc')),
		Either.chain(() => runCommand('tsc -p tsconfig.esmodule.json'))
	);

const copyPackageJson = (): Try.Try<void> =>
	pipe(
		File.readFileSync(PACKAGE_JSON_PATH),
		Either.chain((_) => Json.parse<PackageJson>(_)),
		Either.map(
			(_): PackageJson => ({
				..._,
				scripts: {
					..._.scripts,
					prepare: undefined
				}
			})
		),
		Either.chain((_) => Json.stringify(_, 2)),
		Either.chain((_) => File.writeFileSync(PACKAGE_JSON_LIB_PATH, _))
	);

pipe(buildProject(), Either.chain(fixEsImports), Either.chain(copyPackageJson), Either.fold(
	(ex) => {
		console.error('Critical error in build', ex);
		process.exit(1);
	},
	() => {
		console.log('Build completed successfully')
		process.exit(0);
	}
));
