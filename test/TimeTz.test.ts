import { addMinutes, format, set } from 'date-fns';
import * as TimeTz from '../src/TimeTz';

const TIMESTAMP_FORMAT = 'yyyy-MM-dd HH:mm:ss.SSS';
const CURRENT_TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;
const OFFSET_MINS = new Date().getTimezoneOffset();

describe('TimeTz', () => {
	it('toUtc and fromUtc', () => {
		const date = new Date();
		const expected = format(
			addMinutes(date, OFFSET_MINS),
			TIMESTAMP_FORMAT
		);

		const actual = format(
			TimeTz.toUtc(CURRENT_TIME_ZONE)(date),
			TIMESTAMP_FORMAT
		);
		expect(actual).toEqual(expected);
	});

	it('format', () => {
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
		const actualUtc = TimeTz.format('UTC')(TIMESTAMP_FORMAT)(date);
		expect(actualUtc).toEqual(expectedUtc);
	});
});
