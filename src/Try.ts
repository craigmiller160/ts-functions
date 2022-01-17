import * as Either from 'fp-ts/Either';
import { unknownToError } from './unknownToError';

export type Try<T> = Either.Either<Error, T>;

export const tryCatch = <T>(fn: () => T): Try<T> =>
	Either.tryCatch(fn, unknownToError);
