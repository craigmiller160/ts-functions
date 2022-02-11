import { IOT } from './types';
import { pipe } from 'fp-ts/function';
import * as IO from 'fp-ts/IO';
import * as RArray from 'fp-ts/ReadonlyArray';

export const cwd = (): IOT<string> => () => process.cwd();

export const allRawArgv = (): IOT<ReadonlyArray<string>> => IO.of(process.argv);

export const allUserArgv = (): IOT<ReadonlyArray<string>> =>
	pipe(IO.of(process.argv), IO.map(RArray.dropLeft(2)));
