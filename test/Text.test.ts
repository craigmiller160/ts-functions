import * as Text from '../src/Text';

describe('Text', () => {
	it('split', () => {
		const result = Text.split(' ')('Hello World');
		expect(result).toEqual(['Hello', 'World']);
	});

	it('concat', () => {
		const result = Text.concat(' ')('Hello', 'World');
		expect(result).toBe('Hello World');
	});
});
