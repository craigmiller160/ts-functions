import { build } from '../../scripts/build';
import { getCwd } from '../../scripts/getCwd';
import path from 'path';

jest.mock('../../scripts/getCwd', () => ({
	getCwd: jest.fn()
}));

const CWD = path.join(process.cwd(), 'test', 'workingDir');
const getCwdMock = getCwd as jest.Mock;

describe('build script', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('builds the artifact with commonjs and esmodule outputs', () => {
		throw new Error();
	});
});
