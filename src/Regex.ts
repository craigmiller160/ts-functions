import * as Option from 'fp-ts/Option';
import { match } from 'ts-pattern';

export const test =
	(regex: RegExp | string) =>
	(text: string): boolean =>
		RegExp(regex).test(text);

export const capture =
	<T>(regex: RegExp | string) =>
	(text: string): Option.Option<T> =>
		match(text)
			.when(test(regex), (_) =>
				Option.some(RegExp(regex).exec(_)?.groups as unknown as T)
			)
			.otherwise(() => Option.none);
