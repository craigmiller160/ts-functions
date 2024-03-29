import { MonoidT, TryT, ValidationT } from './types';
import { identity, pipe } from 'fp-ts/function';
import * as Either from 'fp-ts/Either';
import * as ioType from 'io-ts';
import { Decoder, Type, ValidationError } from 'io-ts';
import { Reporter } from 'io-ts/Reporter';
import * as RArray from 'fp-ts/ReadonlyArray';
import { match } from 'ts-pattern';
import * as Monoid from 'fp-ts/Monoid';

export class TypeValidationError extends Error {
	readonly name = 'TypeValidationError';
	constructor(errors: ReadonlyArray<string>) {
		super();
		this.message = errors.join('\n');
	}
}

export type TypeDecoder<O, I = unknown> = (input: I) => TryT<O>;

export const decode =
	<A, O = A, I = unknown>(ioTsType: Type<A, O, I>): TypeDecoder<A, I> =>
	(input: I): TryT<A> =>
		pipe(ioTsType.decode(input), handleResult);

export const handleResult = <T>(result: ValidationT<T>): TryT<T> =>
	pipe(
		result,
		Either.mapLeft(ioType.failures),
		Either.mapLeft(ReadableReporter.report),
		Either.mapLeft((report) => new TypeValidationError(report))
	);

enum CurrentEntryType {
	OBJECT,
	ARRAY
}

interface ReportPathContext {
	readonly path: string;
	readonly currentEntryDecoder: Decoder<unknown, unknown>;
	readonly currentEntryType: CurrentEntryType;
}

const startsWith = (startingString: string) => (value: string) =>
	value.startsWith(startingString);

const typeToCurrentEntryType = (
	type: Decoder<unknown, unknown>
): CurrentEntryType =>
	match(type.name)
		.when(startsWith('Array'), () => CurrentEntryType.ARRAY)
		.when(startsWith('ReadonlyArray'), () => CurrentEntryType.ARRAY)
		.otherwise(() => CurrentEntryType.OBJECT);

const reportPathContextMonoid: MonoidT<ReportPathContext> = {
	empty: {
		path: '',
		currentEntryDecoder: ioType.unknown,
		currentEntryType: CurrentEntryType.OBJECT
	},
	concat: (
		ctx1: ReportPathContext,
		ctx2: ReportPathContext
	): ReportPathContext => {
		if (ctx1.path === '') {
			return ctx2;
		}

		const newPath = match(ctx1.currentEntryType)
			.with(CurrentEntryType.ARRAY, () => `${ctx1.path}[${ctx2.path}]`)
			.otherwise(() => `${ctx1.path}.${ctx2.path}`);
		return {
			path: newPath,
			currentEntryDecoder: ctx2.currentEntryDecoder,
			currentEntryType: ctx2.currentEntryType
		};
	}
};

const createErrorMessage = (error: ValidationError): string => {
	const fullContext = pipe(
		error.context,
		RArray.map(
			(ctx): ReportPathContext => ({
				path: ctx.key,
				currentEntryDecoder: ctx.type,
				currentEntryType: typeToCurrentEntryType(ctx.type)
			})
		),
		Monoid.concatAll(reportPathContextMonoid)
	);

	const typeName = fullContext.currentEntryDecoder.name.replace(/<.*$/, '');
	return `IO Type Error: Expected '${
		fullContext.path
	}' to be type '${typeName}', received '${JSON.stringify(error.value)}'`;
};

const createReadableReport = (
	errors: ReadonlyArray<ValidationError>
): ReadonlyArray<string> => pipe(errors, RArray.map(createErrorMessage));

export const ReadableReporter: Reporter<ReadonlyArray<string>> = {
	report: (result: ValidationT<unknown>): ReadonlyArray<string> =>
		pipe(
			result,
			Either.mapLeft(createReadableReport),
			Either.fold(identity, () => [])
		)
};
