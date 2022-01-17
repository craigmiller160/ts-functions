import * as Json from '../src/Json';
import * as Try from '../src/Try';
import '@relmify/jest-fp-ts';

interface Value {
	readonly one: string;
}

describe('Json', () => {
	it('parse', () => {
		const text = '{"one":"two"}';
		const result: Try.Try<Value> = Json.parse<Value>(text);
		expect(result).toEqualRight({
			one: 'two'
		});
	});

	it('stringify', () => {
		const value: Value = {
			one: 'two'
		};
		const result: Try.Try<string> = Json.stringify(value);
		expect(result).toEqualRight('{"one":"two"}');
	});
});
