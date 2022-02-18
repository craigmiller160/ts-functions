import * as ioType from 'io-ts';
import * as TypeValidation from '../src/TypeValidation';
import '@relmify/jest-fp-ts';
import { TypeValidationError } from '../src/TypeValidation';

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
});
