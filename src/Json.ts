import * as Try from './Try';
import { TryT, OptionT } from './types';
import { pipe } from 'fp-ts/function';
import * as Option from 'fp-ts/Option';

export const parseE = <T>(json: string): TryT<T> =>
	Try.tryCatch(() => JSON.parse(json));

export const stringifyE = (value: unknown): TryT<string> =>
	stringifyIndentE(0)(value);

export const stringifyIndentE =
	(indent: number) =>
	(value: unknown): TryT<string> =>
		Try.tryCatch(() => JSON.stringify(value, null, indent));

export const parseO = <T>(json: string): OptionT<T> =>
	pipe(parseE<T>(json), Option.fromEither);

export const stringifyO = (value: unknown): OptionT<string> =>
	pipe(stringifyE(value), Option.fromEither);

export const stringifyIndentO =
	(indent: number) =>
	(value: unknown): OptionT<string> =>
		pipe(stringifyIndentE(indent)(value), Option.fromEither);
