import { describe, it, expect } from 'vitest';
import * as Either from 'fp-ts/Either';
import * as EitherExt from '../src/EitherExt';
import { EitherT } from '../src/types';
import { unknownToError } from '../src/unknownToError';

const e: EitherT<Error, string> = Either.right('Hello');

describe('EitherExt', () => {
	describe('chainTryCatch', () => {
		it('successful', () => {
			const result = EitherExt.chainTryCatch(
				(value: string) => `${value} World`,
				unknownToError
			)(e);
			expect(result).toEqualRight('Hello World');
		});

		it('fails', () => {
			const result = EitherExt.chainTryCatch(() => {
				throw new Error('Dying');
			}, unknownToError)(e);
			expect(result).toEqualLeft(new Error('Dying'));
		});
	});
});
