import { IOT } from './types';
import { pipe } from 'fp-ts/function';
import * as Json from './Json';
import * as Option from 'fp-ts/Option';

export type BaseLog<R> = (msg: string) => R;
export type ErrorLog<R> = (msg: string, error: Error) => R;
export type JsonLog<R> = (
	msg: string,
	value: object | ReadonlyArray<unknown>
) => R;

export interface BaseLogger<R> {
	readonly debug: BaseLog<R>;
	readonly info: BaseLog<R>;
	readonly warn: BaseLog<R>;
	readonly error: BaseLog<R>;
	readonly verbose: BaseLog<R>;
}

export interface EnhancedLogger<R> extends BaseLogger<R> {
	readonly errorWithStack: ErrorLog<R>;
	readonly warnWithStack: ErrorLog<R>;
	readonly infoWithStack: ErrorLog<R>;
	readonly debugWithStack: ErrorLog<R>;
	readonly verboseWithStack: ErrorLog<R>;

	readonly debugWithJson: JsonLog<R>;
	readonly infoWithJson: JsonLog<R>;
	readonly warnWithJson: JsonLog<R>;
	readonly errorWithJson: JsonLog<R>;
	readonly verboseWithJson: JsonLog<R>;
}

export type ProvidedLogger = BaseLogger<void>;
export type Logger = EnhancedLogger<IOT<void>>;

const info =
	(provided: ProvidedLogger): BaseLog<IOT<void>> =>
	(msg) =>
	() =>
		provided.info(msg);

const debug =
	(provided: ProvidedLogger): BaseLog<IOT<void>> =>
	(msg) =>
	() =>
		provided.debug(msg);

const warn =
	(provided: ProvidedLogger): BaseLog<IOT<void>> =>
	(msg) =>
	() =>
		provided.warn(msg);

const error =
	(provided: ProvidedLogger): BaseLog<IOT<void>> =>
	(msg) =>
	() =>
		provided.error(msg);

const verbose =
	(provided: ProvidedLogger): BaseLog<IOT<void>> =>
	(msg) =>
	() =>
		provided.verbose(msg);

const getMessageWithStack = (msg: string, error: Error): string =>
	`${msg} ${error.stack ?? ''}`;

const errorWithStack =
	(provided: ProvidedLogger): ErrorLog<IOT<void>> =>
	(msg, error) =>
	() =>
		provided.error(getMessageWithStack(msg, error));

const warnWithStack =
	(provided: ProvidedLogger): ErrorLog<IOT<void>> =>
	(msg, error) =>
	() =>
		provided.warn(getMessageWithStack(msg, error));

const infoWithStack =
	(provided: ProvidedLogger): ErrorLog<IOT<void>> =>
	(msg, error) =>
	() =>
		provided.info(getMessageWithStack(msg, error));

const debugWithStack =
	(provided: ProvidedLogger): ErrorLog<IOT<void>> =>
	(msg, error) =>
	() =>
		provided.debug(getMessageWithStack(msg, error));

const verboseWithStack =
	(provided: ProvidedLogger): ErrorLog<IOT<void>> =>
	(msg, error) =>
	() =>
		provided.verbose(getMessageWithStack(msg, error));

const getMessageWithJson = (
	msg: string,
	value: object | ReadonlyArray<unknown>
): string =>
	pipe(
		Json.stringifyO(value),
		Option.fold(
			() => msg,
			(_) => `${msg} ${_}`
		)
	);

const debugWithJson =
	(provided: ProvidedLogger): JsonLog<IOT<void>> =>
	(msg, value) =>
	() =>
		provided.debug(getMessageWithJson(msg, value));

const infoWithJson =
	(provided: ProvidedLogger): JsonLog<IOT<void>> =>
	(msg, value) =>
	() =>
		provided.info(getMessageWithJson(msg, value));

const warnWithJson =
	(provided: ProvidedLogger): JsonLog<IOT<void>> =>
	(msg, value) =>
	() =>
		provided.warn(getMessageWithJson(msg, value));

const errorWithJson =
	(provided: ProvidedLogger): JsonLog<IOT<void>> =>
	(msg, value) =>
	() =>
		provided.error(getMessageWithJson(msg, value));