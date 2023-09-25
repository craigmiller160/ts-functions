import { describe, it, expect } from 'vitest';
import * as ioType from 'io-ts';
import * as TypeValidation from '../src/TypeValidation';
import { ReadableReporter, TypeValidationError } from '../src/TypeValidation';
import * as File from '../src/File';
import * as Json from '../src/Json';
import path from 'path';
import { pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';
import * as IO from 'fp-ts/IO';
import { tradierHistoryV } from './testutils/TradierHistory';

const TheTypeV = ioType.type({
	hello: ioType.string
});
type TheType = ioType.TypeOf<typeof TheTypeV>;

describe('TypeValidation', () => {
	describe('handleResult', () => {
		it('success', () => {
			const data: TheType = {
				hello: 'world'
			};
			const validationResult = TheTypeV.decode(data);
			const result = TypeValidation.handleResult(validationResult);
			expect(result).toEqualRight(data);
		});

		it('failure', () => {
			const data = {
				hello: 11
			};
			const validationResult = TheTypeV.decode(data);
			const result = TypeValidation.handleResult(validationResult);
			expect(result).toEqualLeft(expect.any(TypeValidationError));
			expect(result).toEqualLeft(
				expect.objectContaining({
					message:
						"IO Type Error: Expected 'hello' to be type 'string', received '11'"
				})
			);
		});
	});

	describe('decode', () => {
		it('success', () => {
			const data: TheType = {
				hello: 'world'
			};
			const result = TypeValidation.decode(TheTypeV)(data);
			expect(result).toEqualRight(data);
		});

		it('failure', () => {
			const data = {
				hello: 11
			};
			const result = TypeValidation.decode(TheTypeV)(data);
			expect(result).toEqualLeft(expect.any(TypeValidationError));
			expect(result).toEqualLeft(
				expect.objectContaining({
					message:
						"IO Type Error: Expected 'hello' to be type 'string', received '11'"
				})
			);
		});
	});

	it('ReadableReporter produces detailed error message', () => {
		const obj = pipe(
			File.readFileSync(
				path.join(__dirname, 'resources', 'BadResponse.json'),
				'utf8'
			),
			IOEither.chainEitherK(Json.parseE),
			IOEither.fold((ex) => {
				throw ex;
			}, IO.of)
		)();
		const result = tradierHistoryV.decode(obj);
		const report = ReadableReporter.report(result);
		expect(report).toEqual([
			"IO Type Error: Expected 'history.day[4].open' to be type 'number', received 'NaN'",
			"IO Type Error: Expected 'history.day[4].high' to be type 'number', received 'NaN'",
			"IO Type Error: Expected 'history.day[4].low' to be type 'number', received 'NaN'",
			"IO Type Error: Expected 'history.day[4].close' to be type 'number', received 'NaN'"
		]);
	});
});
