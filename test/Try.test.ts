import * as Try from '../src/Try';
import * as Either from 'fp-ts/Either';
import { identity } from 'fp-ts/function';
import '@relmify/jest-fp-ts';
import { getOrThrow } from '../src/Try';

describe('Try', () => {
	it('tryCatch', () => {
		const successTry: Try.Try<string> = Try.tryCatch(() => 'Hello');
		const failTry: Try.Try<string> = Try.tryCatch(() => {
			throw new Error('Dying');
		});

		expect(successTry).toEqualRight('Hello');
		expect(failTry).toEqualLeft(new Error('Dying'));
	});

	it('Try<T> is interchangeable with Either<Error,T>', () => {
		const theTry = Try.tryCatch(() => 'Hello');
		const result = Either.fold((ex) => 'Failed', identity)(theTry);
		expect(result).toEqual('Hello');
	});

	it('getOrThrow', () => {
		const successTry: Try.Try<string> = Try.tryCatch(() => 'Hello');
		const failTry: Try.Try<string> = Try.tryCatch(() => {
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
});
