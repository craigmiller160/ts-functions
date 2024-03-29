import { P, match } from 'ts-pattern';

export const unknownToError = (theUnknown: unknown): Error =>
	match<unknown, Error>(theUnknown)
		.with(P.instanceOf(Error), (_) => _)
		.otherwise((_) => new Error(`Unknown Error: ${JSON.stringify(_)}`));
