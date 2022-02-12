import * as TaskEither from 'fp-ts/TaskEither';
import * as Task from 'fp-ts/Task';
import { unknownToError } from './unknownToError';
import { Lazy } from 'fp-ts/function';
import { TaskT } from './types';
import * as TaskEitherExt from './TaskEitherExt';

export type TaskTry<T> = TaskEither.TaskEither<Error, T>;

export const tryCatch = <T>(fn: Lazy<Promise<T>>): TaskTry<T> =>
	TaskEither.tryCatch(fn, unknownToError);

export const getOrThrow = <T>(theTry: TaskTry<T>): TaskT<T> =>
	TaskEither.fold((ex) => {
		throw ex;
	}, Task.of)(theTry);

export const chainTryCatch =
	<T1, T2>(fn: (value: T1) => Promise<T2>) =>
	(ma: TaskTry<T1>): TaskTry<T2> =>
		TaskEitherExt.chainTryCatch(fn, unknownToError)(ma);
