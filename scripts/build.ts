/* eslint-disable no-console */
import spawn from 'cross-spawn';
import path from 'path';
import { flow, pipe } from 'fp-ts/function';
import * as File from '../src/File';
import * as Try from '../src/Try';
import * as Either from 'fp-ts/Either';
import { match } from 'ts-pattern';
import * as Arr from 'fp-ts/Array';
import * as Text from '../src/Text';
import * as Regex from '../src/Regex';
import * as Option from 'fp-ts/Option';

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

const fixEsImports = (): Try.Try<any> => {
	console.log('Fixing ES Imports');

	return pipe(
		File.listFilesSync(ES_LIB_PATH),
		Either.chain(flow(Arr.map(fixImportsInFile), Either.sequenceArray)),
		Either.chain(flow(Arr.map(writeFile), Either.sequenceArray))
	);
};

const buildProject = (): Try.Try<string> =>
	pipe(
		File.rmIfExistsSync(LIB_PATH),
		Either.chain(() => runCommand('tsc')),
		Either.chain(() => runCommand('tsc -p tsconfig.esmodule.json'))
	);

pipe(buildProject(), Either.chain(fixEsImports));

// const fixEsImports2 = () => {
// 	console.log('Fixing ES Imports');
// 	const esOutput = path.join(process.cwd(), 'lib', 'es');
// 	const files = fs.readdirSync(esOutput);
// 	files.forEach((file) => {
// 		const fullFilePath = path.join(esOutput, file);
// 		const text = fs.readFileSync(fullFilePath, 'utf8');
// 		const newText = text
// 			.split('\n')
// 			.map((line) => {
// 				if (FP_TS_REGEX.test(line)) {
// 					const groups = FP_TS_REGEX.exec(line)
// 						?.groups as unknown as FpTsGroups;
// 					return `${groups.importName}'fp-ts/es6/${groups.fileName}';`;
// 				}
// 				return line;
// 			})
// 			.join('\n');
// 		fs.writeFileSync(fullFilePath, newText);
// 	});
// };

// const copyPackageJson = () => {
// 	const packageJsonTxt = fs.readFileSync(
// 		path.join(process.cwd(), 'package.json'),
// 		'utf8'
// 	);
// 	const packageJson = JSON.parse(packageJsonTxt) as PackageJson;
// 	delete packageJson.scripts.prepare;
// 	fs.writeFileSync(
// 		path.join(process.cwd(), 'lib', 'package.json'),
// 		JSON.stringify(packageJson, null, 2)
// 	);
// };
//
// fixEsImports2();
// copyPackageJson();
