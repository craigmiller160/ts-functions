import * as IOEither from 'fp-ts/IOEither';
import { Lazy } from 'fp-ts/function';
import { unknownToError } from './unknownToError';

export type IOTry<T> = IOEither.IOEither<Error, T>;

export const tryCatch = <T>(fn: Lazy<T>): IOTry<T> =>
	IOEither.tryCatch(fn, unknownToError);
