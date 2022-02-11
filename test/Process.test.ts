import * as Process from '../src/Process';

describe('Process', () => {
	it('cwd', () => {
		const expected = process.cwd();
		const actual = Process.cwd()();
		expect(actual).toEqual(expected);
	});

	it('allRawArgv', () => {
		throw new Error();
	});

	it('allUserArgv', () => {
		throw new Error();
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
