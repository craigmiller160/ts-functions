import * as TaskEither from 'fp-ts/TaskEither';
import * as Task from 'fp-ts/Task';
import { unknownToError } from './unknownToError';

export type TaskTry<T> = TaskEither.TaskEither<Error, T>;

export const tryCatch = <T>(fn: () => Promise<T>): TaskTry<T> =>
	TaskEither.tryCatch(fn, unknownToError);

export const getOrThrow = <T>(theTry: TaskTry<T>): Task.Task<T> =>
	TaskEither.fold((ex) => {
		throw ex;
	}, Task.of)(theTry);
