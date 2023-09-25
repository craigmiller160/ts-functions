import { describe, it, expect } from 'vitest';
import { match } from 'ts-pattern';
import * as Pattern from '../src/Pattern';

const lengthPattern =
	(pattern: (l: number) => (v: string) => boolean) => (length: number) =>
		match('Hello')
			.when(pattern(length), () => 'Success')
			.otherwise(() => 'Failure');

describe('Pattern', () => {
	it('lengthGT', () => {
		const fn = lengthPattern(Pattern.lengthGT);

		expect(fn(3)).toBe('Success');
		expect(fn(5)).toBe('Failure');
		expect(fn(6)).toBe('Failure');
	});

	it('lengthGTE', () => {
		const fn = lengthPattern(Pattern.lengthGTE);

		expect(fn(3)).toBe('Success');
		expect(fn(5)).toBe('Success');
		expect(fn(6)).toBe('Failure');
	});

	it('lengthEQ', () => {
		const fn = lengthPattern(Pattern.lengthEQ);

		expect(fn(3)).toBe('Failure');
		expect(fn(5)).toBe('Success');
		expect(fn(6)).toBe('Failure');
	});

	it('lengthLT', () => {
		const fn = lengthPattern(Pattern.lengthLT);

		expect(fn(3)).toBe('Failure');
		expect(fn(5)).toBe('Failure');
		expect(fn(6)).toBe('Success');
	});

	it('lengthLTE', () => {
		const fn = lengthPattern(Pattern.lengthLTE);

		expect(fn(3)).toBe('Failure');
		expect(fn(5)).toBe('Success');
		expect(fn(6)).toBe('Success');
	});
});
