import { describe, it, expect } from 'vitest';
import { unknownToError } from '../src/unknownToError';

export {};

describe('unknownToError', () => {
	it('handles Error', () => {
		const error = new Error('FooBar');
		error.name = 'SpecialError';
		const result = unknownToError(error);
		expect(result).toEqual(error);
		expect(result.name).toEqual(error.name);
	});

	it('handles other value', () => {
		const value = 'HelloWorld';
		const result = unknownToError(value);
		expect(result).toEqual(new Error(`Unknown Error: "${value}"`));
	});
});
