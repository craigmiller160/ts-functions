/* eslint-disable no-console */
import spawn from 'cross-spawn';
import { SpawnSyncReturns } from 'child_process';
import path from 'path';
import fs from 'fs';
import { pipe } from 'fp-ts/function';
import * as File from '../src/File';
import * as Try from '../src/Try'
import * as Either from 'fp-ts/Either';
import { match } from 'ts-pattern';

interface PackageJson {
	scripts: {
		prepare?: string;
	};
}

interface FpTsGroups {
	readonly importName: string;
	readonly fileName: string;
}

const FP_TS_REGEX = /^(?<importName>.*)'fp-ts\/(?<fileName>.*)';$/;
const LIB_PATH = path.join(process.cwd(), 'lib');

const runCommand = (command: string): Try.Try<string> => {
	const result = spawn.sync('bash', ['-c', command], {
		stdio: 'inherit'
	});
	return match(result)
		.with({ status: 0 }, () => Either.right(command))
		.otherwise(() => Either.left(new Error(`Command failed: ${command}`)));
}

const buildProject = () => {
	pipe(
		LIB_PATH,
		File.rmIfExistsSync,
		Either.chain(() => runCommand('tsc')),
		Either.chain(() => runCommand('tsc -p tsconfig.esmodule.json'))
	);
};

// TODO delete below here
process.exit(0);


const fixEsImports = () => {
	console.log('Fixing ES Imports');
	const esOutput = path.join(process.cwd(), 'lib', 'es');
	const files = fs.readdirSync(esOutput);
	files.forEach((file) => {
		const fullFilePath = path.join(esOutput, file);
		const text = fs.readFileSync(fullFilePath, 'utf8');
		const newText = text
			.split('\n')
			.map((line) => {
				if (FP_TS_REGEX.test(line)) {
					const groups = FP_TS_REGEX.exec(line)
						?.groups as unknown as FpTsGroups;
					return `${groups.importName}'fp-ts/es6/${groups.fileName}';`;
				}
				return line;
			})
			.join('\n');
		fs.writeFileSync(fullFilePath, newText);
	});
};

const copyPackageJson = () => {
	const packageJsonTxt = fs.readFileSync(
		path.join(process.cwd(), 'package.json'),
		'utf8'
	);
	const packageJson = JSON.parse(packageJsonTxt) as PackageJson;
	delete packageJson.scripts.prepare;
	fs.writeFileSync(
		path.join(process.cwd(), 'lib', 'package.json'),
		JSON.stringify(packageJson, null, 2)
	);
};

const failIfError = (fn: () => SpawnSyncReturns<Buffer>) => {
	const result = fn();
	if (result.status !== 0) {
		process.exit(result.status ?? -1);
	}
};

fixEsImports();
copyPackageJson();
