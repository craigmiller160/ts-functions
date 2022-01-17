import * as Try from './Try';

export const encode = (part: string | number | boolean): Try.Try<string> =>
	Try.tryCatch(() => encodeURIComponent(part));
