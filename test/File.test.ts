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
		const result = File.readFileSync(filePath)();
		expect(result).toEqualRight(TEXT);
	});

	it('writeFileSync', () => {
		const filePath = path.join(TEMP_PATH, 'file.txt');
		File.writeFileSync(filePath, TEXT)();

		const fileContent = fs.readFileSync(filePath, 'utf8');
		expect(fileContent).toEqual(TEXT);
	});

	it('appendFileSync', () => {
		const filePath = path.join(TEMP_PATH, 'file.txt');
		File.appendFileSync(filePath, TEXT)();
		File.appendFileSync(filePath, TEXT)();

		const fileContent = fs.readFileSync(filePath, 'utf8');
		expect(fileContent).toEqual(`${TEXT}${TEXT}`);
	});

	it('existsSync', () => {
		const filePath = path.join(TEMP_PATH, 'file.txt');
		fs.writeFileSync(filePath, TEXT);

		const result = File.existsSync(filePath)();
		expect(result).toEqualRight(true);
	});

	it('rmIfExistsSync file', () => {
		const filePath = path.join(TEMP_PATH, 'file.txt');
		fs.writeFileSync(filePath, TEXT);

		const result = File.rmIfExistsSync(filePath)();
		expect(result).toBeRight();
		expect(fs.existsSync(filePath)).toEqual(false);
	});

	it('rmIfExistsSync directory', () => {
		const dirPath = path.join(TEMP_PATH, 'dir');
		const filePath = path.join(dirPath, 'file.txt');
		fs.mkdirSync(dirPath);
		fs.writeFileSync(filePath, TEXT);

		const result = File.rmIfExistsSync(dirPath)();
		expect(result).toBeRight();
		expect(fs.existsSync(filePath)).toEqual(false);
		expect(fs.existsSync(dirPath)).toEqual(false);
	});

	it('mkdirSync', () => {
		const dirPath = path.join(TEMP_PATH, 'dir');

		const result = File.mkdirSync(dirPath)();
		expect(result).toEqualRight(dirPath);
		expect(fs.existsSync(dirPath)).toEqual(true);
	});

	it('listFilesSync', () => {
		const file1 = path.join(TEMP_PATH, 'file1.txt');
		const file2 = path.join(TEMP_PATH, 'file2.txt');
		fs.writeFileSync(file1, TEXT);
		fs.writeFileSync(file2, TEXT);

		const result = File.listFilesSync(TEMP_PATH)();
		expect(result).toEqualRight(['file1.txt', 'file2.txt']);
	});
});
