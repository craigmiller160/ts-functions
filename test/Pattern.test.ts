import { match } from 'ts-pattern';
import * as Pattern from '../src/Pattern';

const URL = 'https://www.google.com/foo/bar?abc=def&ghi=jkl';
const URL_REGEX = /^https?:\/\/(?<hostname>.*?)\/.*\?(?<query>.*)$/;

const doMatchPattern = (value: string): string =>
	match(value)
		.with(Pattern.regex(URL_REGEX), () => 'Success')
		.otherwise(() => 'Failure');

describe('Pattern', () => {
	it('regex', () => {
		expect(doMatchPattern(URL)).toEqual('Success');
		expect(doMatchPattern('abc')).toEqual('Failure');
	});
});
