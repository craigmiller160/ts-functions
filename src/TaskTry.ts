import * as TaskEither from 'fp-ts/TaskEither';
import { unknownToError } from './unknownToError';
import {match, when} from 'ts-pattern';
import * as Task from 'fp-ts/Task';

export type TaskTry<T> = TaskEither.TaskEither<Error, T>;

export const tryCatch = <T>(fn: () => Promise<T>): TaskTry<T> =>
	TaskEither.tryCatch(fn, unknownToError);

// export const getOrThrow = <T>(either: TaskTry<T>): Task.Task<T> =>
// 	match<TaskTry<T>>(either)
// 		.with(when(TaskEither.isRight), (_) => Task.of(_.right))
// 		.with(when(TaskEither.isLeft), (_) => {
// 			throw _.left;
// 		})
// 		.exhaustive();