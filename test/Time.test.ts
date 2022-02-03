import {
	addMinutes,
	addMonths,
	addYears,
	addWeeks,
	format,
	parse,
	addHours,
	addDays,
	subMinutes,
	subHours,
	subDays,
	subWeeks,
	subMonths,
	subYears,
	set
} from 'date-fns';
import * as Time from '../src/Time';
import { SetTimeOptions } from '../src/Time';

const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';
const OFFSET_MINS = new Date().getTimezoneOffset();
const TIMESTAMP_FORMAT = 'yyyy-MM-dd HH:mm:ss.SSS';

describe('DateFns', () => {
	it('addMinutes', () => {
		const date = new Date();
		const expected = addMinutes(date, 10);
		const actual = Time.addMinutes(10)(date);
		expect(actual).toEqual(expected);
	});

	it('addHours', () => {
		const date = new Date();
		const expected = addHours(date, 1);
		const actual = Time.addHours(1)(date);
		expect(actual).toEqual(expected);
	});

	it('addDays', () => {
		const date = new Date();
		const expected = addDays(date, 1);
		const actual = Time.addDays(1)(date);
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

	it('subMinutes', () => {
		const date = new Date();
		const expected = subMinutes(date, 1);
		const actual = Time.subMinutes(1)(date);
		expect(actual).toEqual(expected);
	});

	it('subHours', () => {
		const date = new Date();
		const expected = subHours(date, 1);
		const actual = Time.subHours(1)(date);
		expect(actual).toEqual(expected);
	});

	it('subDays', () => {
		const date = new Date();
		const expected = subDays(date, 1);
		const actual = Time.subDays(1)(date);
		expect(actual).toEqual(expected);
	});

	it('subWeeks', () => {
		const date = new Date();
		const expected = subWeeks(date, 1);
		const actual = Time.subWeeks(1)(date);
		expect(actual).toEqual(expected);
	});

	it('subMonths', () => {
		const date = new Date();
		const expected = subMonths(date, 1);
		const actual = Time.subMonths(1)(date);
		expect(actual).toEqual(expected);
	});

	it('subYears', () => {
		const date = new Date();
		const expected = subYears(date, 1);
		const actual = Time.subYears(1)(date);
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

	it('set with all options', () => {
		const date = new Date();
		const options: SetTimeOptions = {
			year: 2000,
			month: 1,
			date: 2,
			hours: 3,
			minutes: 4,
			seconds: 5,
			milliseconds: 6
		};

		const expected = set(date, options);
		const actual = Time.set(options)(date);

		expect(actual).toEqual(expected);
	});

	it('set with just time', () => {
		const date = new Date();
		const options: SetTimeOptions = {
			hours: 0,
			minutes: 0,
			seconds: 0,
			milliseconds: 0
		};
		const expected = set(date, options);
		const actual = Time.set(options)(date);
		expect(actual).toEqual(expected);
	});

	it('formatTZ', () => {
		const date = set(new Date(), {
			year: 2020,
			month: 1,
			date: 1,
			hours: 0,
			minutes: 0,
			seconds: 0,
			milliseconds: 0
		});
		const expectedUtc = format(
			addMinutes(date, OFFSET_MINS),
			TIMESTAMP_FORMAT
		);
		const actualUtc = Time.formatTZ('UTC')(TIMESTAMP_FORMAT)(date);
		expect(actualUtc).toEqual(expectedUtc);
	});

	it('setUtc', () => {
		throw new Error();
	});
});
