import { describe, it, expect, beforeEach } from 'vitest';
import { createLogger, Logger, ProvidedLogger } from '../src/Logger';

interface TestProvidedLogger extends ProvidedLogger {
	value: string;
}

const error = new Error('Dying');
const obj = {
	abc: 'def'
};
const objString = JSON.stringify(obj);

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
		expect(testLogger.value).toBe('Debug: Hello World');
	});

	it('info', () => {
		logger.info('Hello World')();
		expect(testLogger.value).toBe('Info: Hello World');
	});

	it('warn', () => {
		logger.warn('Hello World')();
		expect(testLogger.value).toBe('Warn: Hello World');
	});

	it('error', () => {
		logger.error('Hello World')();
		expect(testLogger.value).toBe('Error: Hello World');
	});

	it('verbose', () => {
		logger.verbose('Hello World')();
		expect(testLogger.value).toBe('Verbose: Hello World');
	});

	it('errorWithStack', () => {
		logger.errorWithStack('Hello', error)();
		expect(testLogger.value).toBe(`Error: Hello ${error.stack ?? ''}`);
	});

	it('warnWithStack', () => {
		logger.warnWithStack('Hello', error)();
		expect(testLogger.value).toBe(`Warn: Hello ${error.stack ?? ''}`);
	});

	it('infoWithStack', () => {
		logger.infoWithStack('Hello', error)();
		expect(testLogger.value).toBe(`Info: Hello ${error.stack ?? ''}`);
	});

	it('debugWithStack', () => {
		logger.debugWithStack('Hello', error)();
		expect(testLogger.value).toBe(`Debug: Hello ${error.stack ?? ''}`);
	});

	it('verboseWithStack', () => {
		logger.verboseWithStack('Hello', error)();
		expect(testLogger.value).toBe(`Verbose: Hello ${error.stack ?? ''}`);
	});

	it('debugWithJson', () => {
		logger.debugWithJson('Hello', obj)();
		expect(testLogger.value).toBe(`Debug: Hello ${objString}`);
	});

	it('infoWithJson', () => {
		logger.infoWithJson('Hello', obj)();
		expect(testLogger.value).toBe(`Info: Hello ${objString}`);
	});

	it('warnWithJson', () => {
		logger.warnWithJson('Hello', obj)();
		expect(testLogger.value).toBe(`Warn: Hello ${objString}`);
	});

	it('errorWithJson', () => {
		logger.errorWithJson('Hello', obj)();
		expect(testLogger.value).toBe(`Error: Hello ${objString}`);
	});

	it('verboseWithJson', () => {
		logger.verboseWithJson('Hello', obj)();
		expect(testLogger.value).toBe(`Verbose: Hello ${objString}`);
	});
});
