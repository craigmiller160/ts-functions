import { MonoidT, TryT, ValidationT } from './types';
import { identity, pipe } from 'fp-ts/function';
import * as Either from 'fp-ts/Either';
import { PathReporter } from 'io-ts/PathReporter';
import * as ioType from 'io-ts';
import { Decoder, Type, ValidationError } from 'io-ts';
import { Reporter } from 'io-ts/Reporter';
import * as RArray from 'fp-ts/ReadonlyArray';
import { match, when } from 'ts-pattern';
import { GuardPattern } from 'ts-pattern/lib/types/Pattern';
import * as Monoid from 'fp-ts/Monoid';

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

enum CurrentEntryType {
	OBJECT,
	ARRAY
}

interface ReportPathContext {
	readonly path: string;
	readonly currentEntryType: CurrentEntryType;
}

const startsWith = (value: string): GuardPattern<string> =>
	when((_) => _.startsWith(value));

const typeToCurrentEntryType = (type: Decoder<any, any>): CurrentEntryType =>
	match(type.name)
		.with(startsWith('Array'), () => CurrentEntryType.ARRAY)
		.with(startsWith('ReadonlyArray'), () => CurrentEntryType.ARRAY)
		.otherwise(() => CurrentEntryType.OBJECT);

const reportPathContextMonoid: MonoidT<ReportPathContext> = {
	empty: {
		path: '',
		currentEntryType: CurrentEntryType.OBJECT
	},
	concat: (ctx1: ReportPathContext, ctx2: ReportPathContext): ReportPathContext => {
		if (ctx1.path === '') {
			return ctx2;
		}


	}
};

const createErrorMessage = (error: ValidationError): string => {
	const fullContext = pipe(
		error.context,
		RArray.map(
			(ctx): ReportPathContext => ({
				path: ctx.key,
				currentEntryType: typeToCurrentEntryType(ctx.type)
			})
		),
		Monoid.concatAll(reportPathContextMonoid)
	);
	// TODO what about the type of the value, that would be useful
	return `IO Type Error: '${fullContext.path}' cannot be ${error.value}`;
};

const createReadableReport = (
	errors: ReadonlyArray<ValidationError>
): ReadonlyArray<string> =>
	pipe(errors, RArray.map(createErrorMessage));

export const ReadableReporter: Reporter<ReadonlyArray<string>> = {
	report: (result: ValidationT<unknown>): ReadonlyArray<string> =>
		pipe(
			result,
			Either.mapLeft(createReadableReport),
			Either.fold(identity, () => [])
		)
};
