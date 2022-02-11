import * as Process from '../src/Process';

describe('Process', () => {
	it('cwd', () => {
		const expected = process.cwd();
		const actual = Process.cwd()();
		expect(actual).toEqual(expected);
	});
});
