import * as Try from './Try';

export const parse = <T>(json: string): Try.Try<T> =>
	Try.tryCatch(() => JSON.parse(json));

export const stringify = (value: unknown, indent = 0): Try.Try<string> =>
	Try.tryCatch(() => JSON.stringify(value, null, indent));
