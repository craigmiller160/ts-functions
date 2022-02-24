import * as ioType from 'io-ts';
import * as TypeValidation from '../src/TypeValidation';
import '@relmify/jest-fp-ts';
import { ReadableReporter, TypeValidationError } from '../src/TypeValidation';
import * as File from '../src/File';
import * as Json from '../src/Json';
import path from 'path';
import { pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';
import * as IO from 'fp-ts/IO';
import { tradierHistoryV } from './testutils/TradierHistory';
import { PathReporter } from 'io-ts/PathReporter';
import * as Either from 'fp-ts/Either';

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
						'Invalid value 11 supplied to : { hello: string }/hello: string'
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
						'Invalid value 11 supplied to : { hello: string }/hello: string'
				})
			);
		});
	});

	// TODO replace this with better tests
	it('error messages', () => {
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
		// const report = PathReporter.report(result);
		// console.log(report);
		const report = ReadableReporter.report(result);
		console.log(report);

		// const errors = pipe(
		// 	result,
		// 	Either.fold(
		// 		(errors) => errors,
		// 		() => []
		// 	)
		// );
		// errors.map((error) => {
		// 	const types = error.context.map((ctx) => ctx.type)
		// 	types[0].name // must start with Array or ReadonlyArray
		// })
	});
});

/*
 * 1) Tag contains "Array" means it's an array, next key will be an index
 * 2) Contexts, the key propertires represent the path to the bad field
 * 3) Return string[]
 */
