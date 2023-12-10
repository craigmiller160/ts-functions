import { describe, it, expect } from 'vitest';
import * as TaskTry from '../src/TaskTry';
import * as TaskEither from 'fp-ts/TaskEither';
import * as Task from 'fp-ts/Task';
import { TaskTryT, TryT } from '../src/types';

const te: TaskTryT<string> = TaskEither.right('Hello');

describe('TaskTry', () => {
	it('tryCatch', async () => {
		const successTry: TaskTryT<string> = TaskTry.tryCatch(
			// eslint-disable-next-line @typescript-eslint/require-await
			async () => 'Hello'
		);
		// eslint-disable-next-line @typescript-eslint/require-await
		const failTry: TaskTryT<string> = TaskTry.tryCatch(async () => {
			throw new Error('Dying');
		});

		const successResult: TryT<string> = await successTry();
		const failResult: TryT<string> = await failTry();

		expect(successResult).toEqualRight('Hello');
		expect(failResult).toEqualLeft(new Error('Dying'));
	});

	it('TaskTry<T> is interchangeable with TaskEither<Error,T>', async () => {
		const successTry: TaskTryT<string> = TaskTry.tryCatch(
			// eslint-disable-next-line @typescript-eslint/require-await
			async () => 'Hello'
		);
		const result = await TaskEither.fold(
			() => Task.of('Failed'),
			(value) => Task.of(value)
		)(successTry)();

		expect(result).toBe('Hello');
	});

	it('getOrThrow', async () => {
		const successTry: TaskTryT<string> = TaskTry.tryCatch(
			// eslint-disable-next-line @typescript-eslint/require-await
			async () => 'Hello'
		);
		// eslint-disable-next-line @typescript-eslint/require-await
		const failTry: TaskTryT<string> = TaskTry.tryCatch(async () => {
			throw new Error('Dying');
		});

		const result = await TaskTry.getOrThrow(successTry)();
		expect(result).toBe('Hello');

		try {
			await TaskTry.getOrThrow(failTry)();
		} catch (ex) {
			expect(ex).toEqual(new Error('Dying'));
			return;
		}
		throw new Error('Should have thrown error');
	});

	describe('chainTryCatch', () => {
		it('successful promise', async () => {
			// eslint-disable-next-line @typescript-eslint/require-await
			const result = await TaskTry.chainTryCatch(
				// eslint-disable-next-line @typescript-eslint/require-await
				async (value: string) => `${value} World`
			)(te)();
			expect(result).toEqualRight('Hello World');
		});

		it('failed promise', async () => {
			// eslint-disable-next-line @typescript-eslint/require-await
			const result = await TaskTry.chainTryCatch(async () => {
				throw new Error('Dying');
			})(te)();
			expect(result).toEqualLeft(new Error('Dying'));
		});
	});
});
