import * as Json from '../src/Json';
import '@relmify/jest-fp-ts';
import { TryT } from '../src/types';

interface Value {
	readonly one: string;
}

describe('Json', () => {
	it('parse', () => {
		const text = '{"one":"two"}';
		const result: TryT<Value> = Json.parse<Value>(text);
		expect(result).toEqualRight({
			one: 'two'
		});
	});

	it('stringify', () => {
		const value: Value = {
			one: 'two'
		};
		const result: TryT<string> = Json.stringify(value);
		expect(result).toEqualRight('{"one":"two"}');
	});
});
