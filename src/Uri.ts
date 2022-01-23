import * as Try from './Try';
import { TryT } from './types';

export const encode = (part: string | number | boolean): TryT<string> =>
	Try.tryCatch(() => encodeURIComponent(part));
