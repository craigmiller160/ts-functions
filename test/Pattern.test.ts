import { match } from 'ts-pattern';
import * as Pattern from '../src/Pattern';
import { GuardPattern } from 'ts-pattern/lib/types/Pattern';

const URL = 'https://www.google.com/foo/bar?abc=def&ghi=jkl';
const URL_REGEX = /^https?:\/\/(?<hostname>.*?)\/.*\?(?<query>.*)$/;

const doMatchRegexPattern = (value: string): string =>
	match(value)
		.with(Pattern.regex(URL_REGEX), () => 'Success')
		.otherwise(() => 'Failure');

const lengthPattern =
	(pattern: (l: number) => GuardPattern<string | Array<unknown>>) =>
	(length: number) =>
		match('Hello')
			.with(pattern(length), () => 'Success')
			.otherwise(() => 'Failure');

describe('Pattern', () => {
	it('regex', () => {
		expect(doMatchRegexPattern(URL)).toEqual('Success');
		expect(doMatchRegexPattern('abc')).toEqual('Failure');
	});

	it('lengthGT', () => {
		const fn = lengthPattern(Pattern.lengthGT);

		expect(fn(3)).toEqual('Success');
		expect(fn(5)).toEqual('Failure');
		expect(fn(6)).toEqual('Failure');
	});

	it('lengthGTE', () => {
		const fn = lengthPattern(Pattern.lengthGTE);

		expect(fn(3)).toEqual('Success');
		expect(fn(5)).toEqual('Success');
		expect(fn(6)).toEqual('Failure');
	});

	it('lengthEQ', () => {
		const fn = lengthPattern(Pattern.lengthEQ);

		expect(fn(3)).toEqual('Failure');
		expect(fn(5)).toEqual('Success');
		expect(fn(6)).toEqual('Failure');
	});

	it('lengthLT', () => {
		const fn = lengthPattern(Pattern.lengthLT);

		expect(fn(3)).toEqual('Failure');
		expect(fn(5)).toEqual('Failure');
		expect(fn(6)).toEqual('Success');
	});

	it('lengthLTE', () => {
		const fn = lengthPattern(Pattern.lengthLTE);

		expect(fn(3)).toEqual('Failure');
		expect(fn(5)).toEqual('Success');
		expect(fn(6)).toEqual('Success');
	});
});
