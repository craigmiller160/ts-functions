import '@relmify/jest-fp-ts';

const URL = 'https://www.google.com/foo/bar?abc=def&ghi=jkl';
const URL_NO_QUERY = 'https://www.google.com/foo/bar';
const URL_REGEX = /^https?:\/\/(?<hostname>.*)\/.*\??(?<query>.*)$/;

describe('Regex', () => {
	describe('captureFromRegex', () => {
		it('has match', () => {
			throw new Error();
		});

		it('has match not all groups', () => {
			throw new Error()
		})

		it('has no match', () => {
			throw new Error();
		});
	});
});
