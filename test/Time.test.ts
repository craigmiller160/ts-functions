import {
	addMinutes,
	addMonths,
	addYears,
	addWeeks,
	format,
	parse
} from 'date-fns';
import * as Time from '../src/Time';

const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';

describe('DateFns', () => {
	it('addMinutes', () => {
		const date = new Date();
		const expected = addMinutes(date, 10);
		const actual = Time.addMinutes(10)(date);
		expect(actual).toEqual(expected);
	});

	it('addWeeks', () => {
		const date = new Date();
		const expected = addWeeks(date, 1);
		const actual = Time.addWeeks(1)(date);
		expect(actual).toEqual(expected);
	});

	it('addMonths', () => {
		const date = new Date();
		const expected = addMonths(date, 1);
		const actual = Time.addMonths(1)(date);
		expect(actual).toEqual(expected);
	});

	it('addYears', () => {
		const date = new Date();
		const expected = addYears(date, 1);
		const actual = Time.addYears(1)(date);
		expect(actual).toEqual(expected);
	});

	it('format', () => {
		const date = new Date();
		const expected = format(date, DATE_FORMAT);
		const actual = Time.format(DATE_FORMAT)(date);
		expect(actual).toEqual(expected);
	});

	it('parse', () => {
		const dateString = '2022-01-01 01:01:01';
		const expected = parse(dateString, DATE_FORMAT, new Date());
		const actual = Time.parse(DATE_FORMAT)(dateString);
		expect(actual).toEqual(expected);
	});

	it('compare', () => {
		const date1String = '2022-01-01 01:01:01';
		const date2String = '2022-02-01 01:01:01';
		const date1 = parse(date1String, DATE_FORMAT, new Date());
		const date2 = parse(date2String, DATE_FORMAT, new Date());

		const result = Time.compare(date1)(date2);
		expect(result).toEqual(-1);
	});
});
