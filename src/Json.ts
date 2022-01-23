import * as Try from './Try';
import { TryT } from './types';

export const parse = <T>(json: string): TryT<T> =>
	Try.tryCatch(() => JSON.parse(json));

export const stringify = (value: unknown, indent = 0): TryT<string> =>
	Try.tryCatch(() => JSON.stringify(value, null, indent));
