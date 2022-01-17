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
		throw new Error();
	});
});
