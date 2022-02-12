import * as Try from '../src/Try';
import * as Either from 'fp-ts/Either';
import { identity } from 'fp-ts/function';
import '@relmify/jest-fp-ts';
import { getOrThrow } from '../src/Try';
import { TryT } from '../src/types';

const t: TryT<string> = Either.right('Hello');

describe('Try', () => {
	it('tryCatch', () => {
		const successTry: TryT<string> = Try.tryCatch(() => 'Hello');
		const failTry: TryT<string> = Try.tryCatch(() => {
			throw new Error('Dying');
		});

		expect(successTry).toEqualRight('Hello');
		expect(failTry).toEqualLeft(new Error('Dying'));
	});

	it('Try<T> is interchangeable with Either<Error,T>', () => {
		const theTry = Try.tryCatch(() => 'Hello');
		const result = Either.fold(() => 'Failed', identity)(theTry);
		expect(result).toEqual('Hello');
	});

	it('getOrThrow', () => {
		const successTry: TryT<string> = Try.tryCatch(() => 'Hello');
		const failTry: TryT<string> = Try.tryCatch(() => {
			throw new Error('Dying');
		});

		const result = getOrThrow(successTry);
		expect(result).toEqual('Hello');

		try {
			getOrThrow(failTry);
		} catch (ex) {
			expect(ex).toEqual(new Error('Dying'));
			return;
		}
		throw new Error('Should have thrown Error');
	});

	describe('chainTryCatch', () => {
		it('successful', () => {
			const result = Try.chainTryCatch(
				(value: string) => `${value} World`
			)(t);
			expect(result).toEqualRight('Hello World');
		});

		it('fails', () => {
			const result = Try.chainTryCatch(() => {
				throw new Error('Dying');
			})(t);
			expect(result).toEqualLeft(new Error('Dying'));
		});
	});
});
