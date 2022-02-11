import { IOT } from './types';

export type BaseLog<R> = (msg: string) => R;
export interface BaseLogger<R> {
	readonly debug: BaseLog<R>;
	readonly info: BaseLog<R>;
	readonly warn: BaseLog<R>;
	readonly error: BaseLog<R>;
	readonly verbose: BaseLog<R>;
}

export type ErrorLog<R> = (msg: string, error: Error) => R;
export type JsonLog<R> = (
	msg: string,
	value: object | ReadonlyArray<unknown>
) => R;

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
