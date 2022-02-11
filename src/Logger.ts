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

export interface EnhancedLogger<R> extends BaseLogger<R> {
	readonly errorWithStack: ErrorLog<R>;
}

export type ProvidedLogger = BaseLogger<void>;
export type Logger = EnhancedLogger<IOT<void>>;
