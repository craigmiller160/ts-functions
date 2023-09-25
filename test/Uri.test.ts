import { describe, it, expect } from 'vitest';
import * as Uri from '../src/Uri';

describe('Uri', () => {
	it('encode', () => {
		const result = Uri.encode('/foo/bar');
		expect(result).toEqualRight('%2Ffoo%2Fbar');
	});
});
