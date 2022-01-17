import * as TaskEither from 'fp-ts/TaskEither';
import { unknownToError } from './unknownToError';

export type TaskTry<T> = TaskEither.TaskEither<Error, T>;

export const tryCatch = <T>(fn: () => Promise<T>): TaskTry<T> =>
	TaskEither.tryCatch(fn, unknownToError);
