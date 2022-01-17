import * as Either from 'fp-ts/Either';
import { unknownToError } from './unknownToError';
import { identity } from 'fp-ts/function';

export type Try<T> = Either.Either<Error, T>;

export const tryCatch = <T>(fn: () => T): Try<T> =>
	Either.tryCatch(fn, unknownToError);

export const getOrThrow = <T>(theTry: Try<T>): T =>
	Either.fold<Error, T, T>((ex) => {
		throw ex;
	}, identity)(theTry);
