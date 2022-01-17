import '@relmify/jest-fp-ts';
import * as Regex from '../src/Regex';
import * as Option from 'fp-ts/Option';

const URL = 'https://www.google.com/foo/bar?abc=def&ghi=jkl';
const URL_NO_QUERY = 'https://www.google.com/foo/bar';
const URL_REGEX = /^https?:\/\/(?<hostname>.*?)\/.*\??(?<query>.*)$/;

interface UrlGroups {
	readonly hostname: string;
	readonly query?: string;
}

const captureUrl = Regex.capture<UrlGroups>(URL_REGEX);;

describe('Regex', () => {
	describe('captureFromRegex', () => {
		it('has match for all groups', () => {
			const result: Option.Option<UrlGroups> = captureUrl(URL);
			expect(result).toEqualSome({
				hostname: 'www.google.com',
				query: 'abc=def&ghi=jkl'
			})
		});

		it('has match but not all groups', () => {
			throw new Error()
		})

		it('has no match', () => {
			throw new Error();
		});
	});
});
