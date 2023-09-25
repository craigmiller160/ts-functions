import { describe, it, expect } from 'vitest';
import * as Json from '../src/Json';
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

	it('stringifyIndentE', () => {
		const value: Value = {
			one: 'two'
		};
		const result: TryT<string> = Json.stringifyIndentE(2)(value);
		expect(result).toEqualRight('{\n  "one": "two"\n}');
	});

	it('stringifyIndentO', () => {
		const value: Value = {
			one: 'two'
		};
		const result: OptionT<string> = Json.stringifyIndentO(2)(value);
		expect(result).toEqualSome('{\n  "one": "two"\n}');
	});
});
