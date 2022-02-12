import * as TaskEither from 'fp-ts/TaskEither';
import * as Task from 'fp-ts/Task';
import { unknownToError } from './unknownToError';
import { Lazy } from 'fp-ts/function';

export type TaskTry<T> = TaskEither.TaskEither<Error, T>;

export const tryCatch = <T>(fn: Lazy<Promise<T>>): TaskTry<T> =>
	TaskEither.tryCatch(fn, unknownToError);

export const getOrThrow = <T>(theTry: TaskTry<T>): Task.Task<T> =>
	TaskEither.fold((ex) => {
		throw ex;
	}, Task.of)(theTry);
