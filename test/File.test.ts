import * as File from '../src/File';
import path from 'path';
import fs from 'fs';

const TEMP_PATH = path.join(process.cwd(), 'node_modules', 'temp_test_dir');

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
		})
	})

	it('readFileSync', () => {
		throw new Error();
	});

	it('existsSync', () => {
		throw new Error();
	});

	it('rmIfExistsSync', () => {
		throw new Error();
	});

	it('mkdirSync', () => {
		throw new Error();
	});

	it('listFilesSync', () => {
		throw new Error();
	});
});
