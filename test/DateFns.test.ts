import { addMinutes } from 'date-fns';
import * as Time from '../src/Time';

describe('DateFns', () => {
	it('addMinutes', () => {
		const date = new Date();
		const expected = addMinutes(date, 10);
		const actual = Time.addMinutes(10)(date);
		expect(actual).toEqual(expected);
	});

	it('format', () => {
		throw new Error();
	});

	it('parse', () => {
		throw new Error();
	});

	it('compareAsc', () => {
		throw new Error();
	});
});
