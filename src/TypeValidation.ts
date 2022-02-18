import { TryT, ValidationT } from './types';
import { pipe } from 'fp-ts/function';
import * as Either from 'fp-ts/Either';
import { PathReporter } from 'io-ts/PathReporter';
import * as ioType from 'io-ts';

// TODO add io-ts to eslint restrictions and build changes

export class TypeValidationError extends Error {
	readonly name = 'TypeValidationError';
	constructor(errors: ReadonlyArray<string>) {
		super();
		this.message = errors.join('\n');
	}
}

export const handleResult = <T>(result: ValidationT<T>): TryT<T> =>
	pipe(
		result,
		Either.mapLeft(ioType.failures),
		Either.mapLeft(PathReporter.report),
		Either.mapLeft((report) => new TypeValidationError(report))
	);
