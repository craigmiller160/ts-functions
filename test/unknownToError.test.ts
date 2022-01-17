export {};

describe('unknownToError', () => {
	it('handles Error', () => {
		throw new Error();
	});

	it('handles other value', () => {
		throw new Error();
	});
});
