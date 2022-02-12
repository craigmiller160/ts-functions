import * as Either from 'fp-ts/Either';
import { unknownToError } from './unknownToError';
import { identity, Lazy } from 'fp-ts/function';
import * as EitherExt from './EitherExt';

export type Try<T> = Either.Either<Error, T>;

export const tryCatch = <T>(fn: Lazy<T>): Try<T> =>
	Either.tryCatch(fn, unknownToError);

export const getOrThrow = <T>(theTry: Try<T>): T =>
	Either.fold<Error, T, T>((ex) => {
		throw ex;
	}, identity)(theTry);

export const chainTryCatch =
	<T1, T2>(fn: (value: T1) => T2) =>
	(ma: Try<T1>): Try<T2> =>
		EitherExt.chainTryCatch(fn, unknownToError)(ma);
