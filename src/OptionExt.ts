import * as Option from 'fp-ts/Option';
import { identity } from 'fp-ts/function';

export const getOrNull = <T>(option: Option.Option<T>): T | null =>
	Option.fold<T, T | null>(() => null, identity)(option);
