import * as Json from '../src/Json';
import '@relmify/jest-fp-ts';
import { TryT, OptionT } from '../src/types';

interface Value {
	readonly one: string;
}

describe('Json', () => {
	it('parseE', () => {
		const text = '{"one":"two"}';
		const result: TryT<Value> = Json.parseE<Value>(text);
		expect(result).toEqualRight({
			one: 'two'
		});
	});

	it('stringifyE', () => {
		const value: Value = {
			one: 'two'
		};
		const result: TryT<string> = Json.stringifyE(value);
		expect(result).toEqualRight('{"one":"two"}');
	});

	it('parseO', () => {
		const text = '{"one":"two"}';
		const result: OptionT<Value> = Json.parseO<Value>(text);
		expect(result).toEqualSome({
			one: 'two'
		});
	});

	it('stringifyO', () => {
		const value: Value = {
			one: 'two'
		};
		const result: OptionT<string> = Json.stringifyO(value);
		expect(result).toEqualSome('{"one":"two"}');
	});
});
