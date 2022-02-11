import * as Process from '../src/Process';

describe('Process', () => {
	it('cwd', () => {
		const expected = process.cwd();
		const actual = Process.cwd()();
		expect(actual).toEqual(expected);
	});

	it('allRawArgv', () => {
		const expected = process.argv;
		const actual = Process.allRawArgv()();
		expect(actual).toEqual(expected);
	});

	it('allUserArgv', () => {
		const expected = process.argv.slice(2);
		const actual = Process.allUserArgv()();
		expect(actual).toEqual(expected);
	});

	it('lookupRawArgv', () => {
		throw new Error();
	});

	it('lookupUserArgv', () => {
		throw new Error();
	});

	it('allEnv', () => {
		throw new Error();
	});

	it('lookupEnv', () => {
		throw new Error();
	});
});
