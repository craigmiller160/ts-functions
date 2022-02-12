import { TaskEitherT } from './types';
import * as TaskEither from 'fp-ts/TaskEither';

// TODO write test
export const chainTryCatch =
	<E, T1, T2>(
		fn: (value: T1) => Promise<T2>,
		onRejected: (reason: unknown) => E
	) =>
	(ma: TaskEitherT<E, T1>): TaskEitherT<E, T2> =>
		TaskEither.chain((value: T1) =>
			TaskEither.tryCatch(() => fn(value), onRejected)
		)(ma);
