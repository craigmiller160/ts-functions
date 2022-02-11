import { IOT } from './types';

export type ProvidedLog = (msg: string) => void;
export interface ProvidedLogger {
	readonly debug: ProvidedLog;
	readonly info: ProvidedLog;
	readonly warn: ProvidedLog;
	readonly error: ProvidedLog;
	readonly verbose: ProvidedLog;
}

export type Log = (msg: string) => IOT<void>;
export interface Logger {
	readonly debug: Log;
	readonly info: Log;
	readonly warn: Log;
	readonly error: Log;
	readonly verbose: Log;
}
