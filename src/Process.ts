import { IOT, OptionT } from './types';
import { pipe } from 'fp-ts/function';
import * as IO from 'fp-ts/IO';
import * as RArray from 'fp-ts/ReadonlyArray';
import * as Option from 'fp-ts/Option';

export const cwd = (): IOT<string> => () => process.cwd();

export const allRawArgv = (): IOT<ReadonlyArray<string>> => IO.of(process.argv);

export const allUserArgv = (): IOT<ReadonlyArray<string>> =>
	pipe(IO.of(process.argv), IO.map(RArray.dropLeft(2)));

export const rawArgvLookupO = (index: number): IOT<OptionT<string>> =>
	pipe(allRawArgv(), IO.map(RArray.lookup(index)));

export const userArgvLookupO = (index: number): IOT<OptionT<string>> =>
	pipe(allUserArgv(), IO.map(RArray.lookup(index)));

export const allEnv = (): IOT<NodeJS.ProcessEnv> => IO.of(process.env);

export const envLookupO = (key: string): IOT<OptionT<string>> =>
	pipe(
		allEnv(),
		IO.map((env) => Option.fromNullable(env[key]))
	);

export const exit = (code: number): IOT<never> => IO.of(process.exit(code));
