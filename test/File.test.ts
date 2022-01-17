import * as File from '../src/File';
import path from 'path';
import fs from 'fs';
import '@relmify/jest-fp-ts';

const TEMP_PATH = path.join(process.cwd(), 'node_modules', 'temp_test_dir');
const TEXT = 'This is the file text';

describe('File', () => {
	beforeEach(() => {
		fs.mkdirSync(TEMP_PATH, {
			recursive: true
		});
	});

	afterEach(() => {
		fs.rmSync(TEMP_PATH, {
			recursive: true,
			force: true
		});
	});

	it('readFileSync', () => {
		const filePath = path.join(TEMP_PATH, 'file.txt');
		fs.writeFileSync(filePath, TEXT);
		const result = File.readFileSync(filePath);
		expect(result).toEqualRight(TEXT);
	});

	it('existsSync', () => {
		const filePath = path.join(TEMP_PATH, 'file.txt');
		fs.writeFileSync(filePath, TEXT);

		const result = File.existsSync(() => 'Success')(filePath);
		expect(result).toEqualSome('Success');
	});

	it('rmIfExistsSync file', () => {
		const filePath = path.join(TEMP_PATH, 'file.txt');
		fs.writeFileSync(filePath, TEXT);

		const result = File.rmIfExistsSync(filePath);
		expect(result).toBeRight();
		expect(fs.existsSync(filePath)).toEqual(false);
	});

	it('rmIfExistsSync directory', () => {
		const dirPath = path.join(TEMP_PATH, 'dir');
		const filePath = path.join(dirPath, 'file.txt');
		fs.mkdirSync(dirPath);
		fs.writeFileSync(filePath, TEXT);

		const result = File.rmIfExistsSync(dirPath);
		expect(result).toBeRight();
		expect(fs.existsSync(filePath)).toEqual(false);
		expect(fs.existsSync(dirPath)).toEqual(false);
	});

	it('mkdirSync', () => {
		throw new Error();
	});

	it('listFilesSync', () => {
		throw new Error();
	});
});
