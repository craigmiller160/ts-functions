import { createLogger, Logger, ProvidedLogger } from '../src/Logger';

export {};

interface TestProvidedLogger extends ProvidedLogger {
	value: string;
}

describe('Logger', () => {
	let testLogger: TestProvidedLogger;
	let logger: Logger;
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
		logger = createLogger(testLogger);
	});

	it('debug', () => {
		logger.debug('Hello World')();
		expect(testLogger.value).toEqual('Debug: Hello World');
	});

	it('info', () => {
		logger.info('Hello World')();
		expect(testLogger.value).toEqual('Info: Hello World');
	});

	it('warn', () => {
		logger.warn('Hello World')();
		expect(testLogger.value).toEqual('Warn: Hello World');
	});

	it('error', () => {
		logger.error('Hello World')();
		expect(testLogger.value).toEqual('Error: Hello World');
	});

	it('verbose', () => {
		logger.verbose('Hello World')();
		expect(testLogger.value).toEqual('Verbose: Hello World');
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
