import * as Process from '../src/Process';
import '@relmify/jest-fp-ts';
import * as Option from 'fp-ts/Option';
import * as Either from 'fp-ts/Either';

describe('Process', () => {
	it('cwd', () => {
		const expected = process.cwd();
		const actual = Process.cwd()();
		expect(actual).toEqual(expected);
	});

	it('allRawArgv', () => {
		const expected = process.argv;
		const actual = Process.allRawArgv()();
		expect(actual).toEqual(expected);
	});

	it('allUserArgv', () => {
		const expected = process.argv.slice(2);
		const actual = Process.allUserArgv()();
		expect(actual).toEqual(expected);
	});

	it('rawArgvLookupO', () => {
		const expected = process.argv[1];
		const actual = Process.rawArgvLookupO(1)();
		expect(actual).toEqualSome(expected);
	});

	it('rawArgvLookupE', () => {
		const expected = process.argv[1];
		const actual = Process.rawArgvLookupE(1)();
		expect(actual).toEqualRight(expected);
	});

	it('userArgvLookupO', () => {
		const expected = Option.fromNullable(process.argv.slice(2)[1]);
		const actual = Process.userArgvLookupO(1)();
		expect(actual).toEqual(expected);
	});

	it('userArgvLookupE', () => {
		const expected = Either.fromOption(
			() => new Error('User Argv not found: 1')
		)(Option.fromNullable(process.argv.slice(2)[1]));
		const actual = Process.userArgvLookupE(1)();
		expect(actual).toEqual(expected);
	});

	it('allEnv', () => {
		const expected = process.env;
		const actual = Process.allEnv()();
		expect(actual).toEqual(expected);
	});

	it('envLookupO', () => {
		const key = Object.keys(process.env)[0];
		const expected = process.env[key];
		const actual = Process.envLookupO(key)();
		expect(actual).toEqualSome(expected);
	});

	it('envLookupE', () => {
		const key = Object.keys(process.env)[0];
		const expected = process.env[key];
		const actual = Process.envLookupE(key)();
		expect(actual).toEqualRight(expected);
	});
});
