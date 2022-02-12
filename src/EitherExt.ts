import { EitherT } from './types';
import * as Either from 'fp-ts/Either';

// TODO write test
export const chainTryCatch =
	<E, T1, T2>(fn: (value: T1) => T2, onRejected: (reason: unknown) => E) =>
	(ma: EitherT<E, T1>): EitherT<E, T2> =>
		Either.chain((value: T1) =>
			Either.tryCatch(() => fn(value), onRejected)
		)(ma);
