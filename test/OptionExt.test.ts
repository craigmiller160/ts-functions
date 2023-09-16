import { describe, it, expect } from 'vitest';
import * as Option from 'fp-ts/Option';
import * as OptionExt from '../src/OptionExt';

describe('OptionExt', () => {
	it('getOrNull', () => {
		const some = Option.some('Hello');
		const none = Option.none;

		const someValue = OptionExt.getOrNull(some);
		expect(someValue).toBe('Hello');

		const noneValue = OptionExt.getOrNull(none);
		expect(noneValue).toBeNull();
	});
});
