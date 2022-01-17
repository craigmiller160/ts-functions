export {};

describe('TaskTry', () => {
	it('tryCatch', () => {
		throw new Error();
	});

	it('TaskTry<T> is interchangeable with TaskEither<Error,T>', () => {
		throw new Error();
	});
});
