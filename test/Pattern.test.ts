import { describe, it, expect } from 'vitest';
import { match } from 'ts-pattern';
import * as Pattern from '../src/Pattern';
import { GuardP } from 'ts-pattern/dist/types/Pattern';

const URL = 'https://www.google.com/foo/bar?abc=def&ghi=jkl';
const URL_REGEX = /^https?:\/\/(?<hostname>.*?)\/.*\?(?<query>.*)$/;

const doMatchRegexPattern = (value: string): string =>
	match(value)
		.with(Pattern.regex(URL_REGEX), () => 'Success')
		.otherwise(() => 'Failure');

const lengthPattern =
	(pattern: (l: number) => GuardP<string | Array<unknown>, boolean>) =>
	(length: number) =>
		match('Hello')
			.with(pattern(length), () => 'Success')
			.otherwise(() => 'Failure');

describe('Pattern', () => {
	it('regex', () => {
		expect(doMatchRegexPattern(URL)).toBe('Success');
		expect(doMatchRegexPattern('abc')).toBe('Failure');
	});

	it('lengthGT', () => {
		const fn = lengthPattern(Pattern.lengthGT);

		expect(fn(3)).toBe('Success');
		expect(fn(5)).toBe('Failure');
		expect(fn(6)).toBe('Failure');
	});

	it('lengthGTE', () => {
		const fn = lengthPattern(Pattern.lengthGTE);

		expect(fn(3)).toBe('Success');
		expect(fn(5)).toBe('Success');
		expect(fn(6)).toBe('Failure');
	});

	it('lengthEQ', () => {
		const fn = lengthPattern(Pattern.lengthEQ);

		expect(fn(3)).toBe('Failure');
		expect(fn(5)).toBe('Success');
		expect(fn(6)).toBe('Failure');
	});

	it('lengthLT', () => {
		const fn = lengthPattern(Pattern.lengthLT);

		expect(fn(3)).toBe('Failure');
		expect(fn(5)).toBe('Failure');
		expect(fn(6)).toBe('Success');
	});

	it('lengthLTE', () => {
		const fn = lengthPattern(Pattern.lengthLTE);

		expect(fn(3)).toBe('Failure');
		expect(fn(5)).toBe('Success');
		expect(fn(6)).toBe('Success');
	});
});
