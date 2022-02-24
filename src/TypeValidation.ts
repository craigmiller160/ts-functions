import { TryT, ValidationT } from './types';
import { identity, pipe } from 'fp-ts/function';
import * as Either from 'fp-ts/Either';
import { PathReporter } from 'io-ts/PathReporter';
import * as ioType from 'io-ts';
import { Type, ValidationError } from 'io-ts';
import { Reporter } from 'io-ts/Reporter';

export class TypeValidationError extends Error {
	readonly name = 'TypeValidationError';
	constructor(errors: ReadonlyArray<string>) {
		super();
		this.message = errors.join('\n');
	}
}

export const decode =
	<A, O = A, I = unknown>(ioTsType: Type<A, O, I>) =>
	(input: I): TryT<A> =>
		pipe(ioTsType.decode(input), handleResult);

export const handleResult = <T>(result: ValidationT<T>): TryT<T> =>
	pipe(
		result,
		Either.mapLeft(ioType.failures),
		Either.mapLeft(PathReporter.report),
		Either.mapLeft((report) => new TypeValidationError(report))
	);

const createReadableReport = (errors: ReadonlyArray<ValidationError>): ReadonlyArray<string> => {
	return [];
};

export const ReadableReporter: Reporter<ReadonlyArray<string>> = {
	report: (result: ValidationT<unknown>): ReadonlyArray<string> =>
		pipe(
			result,
			Either.mapLeft(createReadableReport),
			Either.fold(
				identity,
				() => []
			)
		)
};
