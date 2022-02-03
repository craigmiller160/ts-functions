import { addMinutes, format } from 'date-fns';
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
		// TODO this will work, above does not
		throw new Error();
	});
});
