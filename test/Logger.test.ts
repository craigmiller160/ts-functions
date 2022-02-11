import { ProvidedLogger } from '../src/Logger';

export {};

interface TestProvidedLogger extends ProvidedLogger {
	value: string;
}

describe('Logger', () => {
	let testLogger: TestProvidedLogger;
	beforeEach(() => {
		testLogger = {
			value: '',
			debug(msg) {
				this.value = `Debug: ${msg}`;
			},
			info(msg) {
				this.value = `Info: ${msg}`;
			},
			warn(msg) {
				this.value = `Warn: ${msg}`;
			},
			error(msg) {
				this.value = `Error: ${msg}`;
			},
			verbose(msg) {
				this.value = `Verbose: ${msg}`;
			}
		};
	});

	it('debug', () => {
		throw new Error();
	});

	it('info', () => {
		throw new Error();
	});

	it('warn', () => {
		throw new Error();
	});

	it('error', () => {
		throw new Error();
	});

	it('verbose', () => {
		throw new Error();
	});

	it('errorWithStack', () => {
		throw new Error();
	});

	it('warnWithStack', () => {
		throw new Error();
	});

	it('infoWithStack', () => {
		throw new Error();
	});

	it('debugWithStack', () => {
		throw new Error();
	});

	it('verboseWithStack', () => {
		throw new Error();
	});

	it('debugWithJson', () => {
		throw new Error();
	});

	it('infoWithJson', () => {
		throw new Error();
	});

	it('warnWithJson', () => {
		throw new Error();
	});

	it('errorWithJson', () => {
		throw new Error();
	});

	it('verboseWithJson', () => {
		throw new Error();
	});
});
