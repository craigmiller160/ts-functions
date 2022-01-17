import * as TaskTry from '../src/TaskTry';
import * as Try from '../src/Try';
import * as TaskEither from 'fp-ts/TaskEither';
import * as Task from 'fp-ts/Task';
import '@relmify/jest-fp-ts';

describe('TaskTry', () => {
	it('tryCatch', async () => {
		const successTry: TaskTry.TaskTry<string> = TaskTry.tryCatch(
			async () => 'Hello'
		);
		const failTry: TaskTry.TaskTry<string> = TaskTry.tryCatch(async () => {
			throw new Error('Dying');
		});

		const successResult: Try.Try<string> = await successTry();
		const failResult: Try.Try<string> = await failTry();

		expect(successResult).toEqualRight('Hello');
		expect(failResult).toEqualLeft(new Error('Dying'));
	});

	it('TaskTry<T> is interchangeable with TaskEither<Error,T>', async () => {
		const successTry: TaskTry.TaskTry<string> = TaskTry.tryCatch(
			async () => 'Hello'
		);
		const result = await TaskEither.fold(
			() => Task.of('Failed'),
			(value) => Task.of(value)
		)(successTry)();

		expect(result).toEqual('Hello');
	});

	it('getOrThrow', async () => {
		const successTry: TaskTry.TaskTry<string> = TaskTry.tryCatch(
			async () => 'Hello'
		);
		const failTry: TaskTry.TaskTry<string> = TaskTry.tryCatch(async () => {
			throw new Error('Dying');
		});

		const result = await TaskTry.getOrThrow(successTry)();
		expect(result).toEqual('Hello');

		try {
			await TaskTry.getOrThrow(failTry)();
		} catch (ex) {
			expect(ex).toEqual(new Error('Dying'));
			return;
		}
		throw new Error('Should have thrown error');
	});
});
