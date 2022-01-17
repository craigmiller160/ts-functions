import * as Try from './Try';

export const encodeForUri = (
	part: string | number | boolean
): Try.Try<string> => Try.tryCatch(() => encodeURIComponent(part));
