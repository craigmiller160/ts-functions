import { describe, it, expect } from 'vitest';
import '@relmify/jest-fp-ts';
import * as Regex from '../src/Regex';
import * as Option from 'fp-ts/Option';

const URL = 'https://www.google.com/foo/bar?abc=def&ghi=jkl';
const URL_REGEX = /^https?:\/\/(?<hostname>.*?)\/.*\?(?<query>.*)$/;

interface UrlGroups {
	readonly hostname: string;
	readonly query: string;
}

const captureUrl = Regex.capture<UrlGroups>(URL_REGEX);
const testUrl = Regex.test(URL_REGEX);

describe('Regex', () => {
	it('test', () => {
		expect(testUrl(URL)).toBe(true);
		expect(testUrl('abc')).toBe(false);
	});

	describe('capture', () => {
		it('has match for all groups', () => {
			const result: Option.Option<UrlGroups> = captureUrl(URL);
			expect(result).toEqualSome({
				hostname: 'www.google.com',
				query: 'abc=def&ghi=jkl'
			});
		});

		it('has no match', () => {
			const result: Option.Option<UrlGroups> = captureUrl('foo-bar');
			expect(result).toBeNone();
		});
	});
});
