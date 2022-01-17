import * as Either from 'fp-ts/Either';
import { unknownToError } from './unknownToError';
import { match, when } from 'ts-pattern';

export type Try<T> = Either.Either<Error, T>;

export const tryCatch = <T>(fn: () => T): Try<T> =>
	Either.tryCatch(fn, unknownToError);

export const getOrThrow = <T>(either: Try<T>): T =>
	match<Try<T>>(either)
		.with(when(Either.isRight), (_) => _.right)
		.with(when(Either.isLeft), (_) => {
			throw _.left;
		})
		.exhaustive();