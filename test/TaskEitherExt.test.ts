import { describe, it, expect } from 'vitest';
import * as TaskEitherExt from '../src/TaskEitherExt';
import { TaskEitherT } from '../src/types';
import * as TaskEither from 'fp-ts/TaskEither';
import { unknownToError } from '../src/unknownToError';

const te: TaskEitherT<Error, string> = TaskEither.right('Hello');

describe('TaskEitherExt', () => {
	describe('chainTryCatch', () => {
		it('successful promise', async () => {
			const result = await TaskEitherExt.chainTryCatch(
				async (value: string) => `${value} World`,
				unknownToError
			)(te)();
			expect(result).toEqualRight('Hello World');
		});

		it('failed promise', async () => {
			const result = await TaskEitherExt.chainTryCatch(async () => {
				throw new Error('Dying');
			}, unknownToError)(te)();
			expect(result).toEqualLeft(new Error('Dying'));
		});
	});
});
