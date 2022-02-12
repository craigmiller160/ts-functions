import * as TaskEitherExt from '../src/TaskEitherExt';

describe('TaskEitherExt', () => {
	describe('chainTryCatch', () => {
		it('successful promise', async () => {
			throw new Error();
		});

		it('failed promise', async () => {
			throw new Error();
		});
	});
});
