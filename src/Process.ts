import { IOT, IOTryT, OptionT } from './types';
import { pipe } from 'fp-ts/function';
import * as IO from 'fp-ts/IO';
import * as RArray from 'fp-ts/ReadonlyArray';
import * as Option from 'fp-ts/Option';
import * as IOEither from 'fp-ts/IOEither';

export const cwd = (): IOT<string> => () => process.cwd();

export const allRawArgv = (): IOT<ReadonlyArray<string>> => IO.of(process.argv);

export const allUserArgv = (): IOT<ReadonlyArray<string>> =>
	pipe(IO.of(process.argv), IO.map(RArray.dropLeft(2)));

export const rawArgvLookupO = (index: number): IOT<OptionT<string>> =>
	pipe(allRawArgv(), IO.map(RArray.lookup(index)));

export const rawArgvLookupE = (index: number): IOTryT<string> =>
	pipe(
		rawArgvLookupO(index),
		IOEither.fromIO,
		IOEither.chain(
			Option.fold(
				() => IOEither.left(new Error(`Raw Argv not found: ${index}`)),
				IOEither.right
			)
		)
	);

export const userArgvLookupO = (index: number): IOT<OptionT<string>> =>
	pipe(allUserArgv(), IO.map(RArray.lookup(index)));

export const userArgvLookupE = (index: number): IOTryT<string> =>
	pipe(
		userArgvLookupO(index),
		IOEither.fromIO,
		IOEither.chain(
			Option.fold(
				() => IOEither.left(new Error(`User Argv not found: ${index}`)),
				IOEither.right
			)
		)
	);

export const allEnv = (): IOT<NodeJS.ProcessEnv> => IO.of(process.env);

export const envLookupO = (key: string): IOT<OptionT<string>> =>
	pipe(
		allEnv(),
		IO.map((env) => Option.fromNullable(env[key]))
	);

export const envLookupE = (key: string): IOTryT<string> =>
	pipe(
		envLookupO(key),
		IOEither.fromIO,
		IOEither.chain(
			Option.fold(
				() => IOEither.left(new Error(`Env not found: ${key}`)),
				IOEither.right
			)
		)
	);

export const exit =
	(code: number): IOT<never> =>
	() =>
		process.exit(code);

export const delayedExit =
	(code: number): IOT<unknown> =>
	() =>
		setTimeout(() => process.exit(code), 500);
