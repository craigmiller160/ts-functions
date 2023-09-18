import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as File from '../src/File';
import path from 'path';
import fs from 'fs';
import * as IOEither from 'fp-ts/IOEither';
import * as Option from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';

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
		File.writeFileSync(filePath)(TEXT)();

		const fileContent = fs.readFileSync(filePath, 'utf8');
		expect(fileContent).toEqual(TEXT);
	});

	it('appendFileSync', () => {
		const filePath = path.join(TEMP_PATH, 'file.txt');
		const appendToFile = File.appendFileSync(filePath);
		pipe(
			appendToFile(TEXT),
			IOEither.chain(() => appendToFile(TEXT))
		)();

		const fileContent = fs.readFileSync(filePath, 'utf8');
		expect(fileContent).toBe(`${TEXT}${TEXT}`);
	});

	it('existsSync', () => {
		const filePath = path.join(TEMP_PATH, 'file.txt');
		fs.writeFileSync(filePath, TEXT);

		const result = File.existsSync(filePath)();
		expect(result).toEqualRight(true);
	});

	it('doIfExistsSync', () => {
		const filePath = path.join(TEMP_PATH, 'file.txt');
		fs.writeFileSync(filePath, TEXT);

		const result = File.doIfExistsSync((path) =>
			IOEither.right(`File: ${path}`)
		)(filePath)();
		expect(result).toEqualRight(Option.some(`File: ${filePath}`));
	});

	it('rmSync file', () => {
		const filePath = path.join(TEMP_PATH, 'file.txt');
		fs.writeFileSync(filePath, TEXT);

		File.rmSync(filePath)();
		expect(fs.existsSync(filePath)).toBe(false);
	});

	it('rmSyncWithOptions file', () => {
		const filePath = path.join(TEMP_PATH, 'file.txt');
		fs.writeFileSync(filePath, TEXT);

		File.rmSyncWithOptions()(filePath)();
		expect(fs.existsSync(filePath)).toBe(false);
	});

	it('rmSyncWithOptions directory', () => {
		const dirPath = path.join(TEMP_PATH, 'dir');
		const filePath = path.join(dirPath, 'file.txt');
		fs.mkdirSync(dirPath);
		fs.writeFileSync(filePath, TEXT);

		File.rmSyncWithOptions({
			recursive: true,
			force: true
		})(dirPath)();

		expect(fs.existsSync(filePath)).toBe(false);
		expect(fs.existsSync(dirPath)).toBe(false);
	});

	it('rmIfExistsSync file', () => {
		const filePath = path.join(TEMP_PATH, 'file.txt');
		fs.writeFileSync(filePath, TEXT);

		const result = File.rmIfExistsSync(filePath)();
		expect(result).toBeRight();
		expect(fs.existsSync(filePath)).toBe(false);
	});

	it('rmIfExistsSyncWithOptions file', () => {
		const filePath = path.join(TEMP_PATH, 'file.txt');
		fs.writeFileSync(filePath, TEXT);

		const result = File.rmIfExistsSyncWithOptions()(filePath)();
		expect(result).toBeRight();
		expect(fs.existsSync(filePath)).toBe(false);
	});

	it('rmIfExistsSyncWithOptions directory', () => {
		const dirPath = path.join(TEMP_PATH, 'dir');
		const filePath = path.join(dirPath, 'file.txt');
		fs.mkdirSync(dirPath);
		fs.writeFileSync(filePath, TEXT);

		const result = File.rmIfExistsSyncWithOptions({
			recursive: true,
			force: true
		})(dirPath)();
		expect(result).toBeRight();
		expect(fs.existsSync(filePath)).toBe(false);
		expect(fs.existsSync(dirPath)).toBe(false);
	});

	it('mkdirSync', () => {
		const dirPath = path.join(TEMP_PATH, 'dir');

		const result = File.mkdirSync(dirPath)();
		expect(result).toEqualRight(dirPath);
		expect(fs.existsSync(dirPath)).toBe(true);
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
