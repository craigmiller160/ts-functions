export {};

describe('Try', () => {
	it('tryCatch', () => {
		throw new Error();
	});

	it('Try<T> is interchangeable with Either<Error,T>', () => {
		throw new Error();
	});
});
