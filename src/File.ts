import fs, { RmOptions } from 'fs';
import * as Option from 'fp-ts/Option';
import { constVoid, pipe } from 'fp-ts/function';
import * as RArr from 'fp-ts/ReadonlyArray';
import { IOTryT, OptionT } from './types';
import * as IOTry from './IOTry';
import * as IOEither from 'fp-ts/IOEither';
import { match } from 'ts-pattern';

export const readFileSync = (
	filePath: string,
	encoding: BufferEncoding = 'utf8'
): IOTryT<string> => IOTry.tryCatch(() => fs.readFileSync(filePath, encoding));

export const writeFileSync =
	(filePath: string) =>
	(content: string): IOTryT<void> =>
		IOTry.tryCatch(() => fs.writeFileSync(filePath, content));

export const appendFileSync =
	(filePath: string) =>
	(content: string): IOTryT<void> =>
		IOTry.tryCatch(() => fs.appendFileSync(filePath, content));

export const existsSync = (filePath: string): IOTryT<boolean> =>
	IOTry.tryCatch(() => fs.existsSync(filePath));

export const doIfExistsSync =
	<T>(fn: (filePath: string) => IOTryT<T>) =>
	(filePath: string): IOTryT<OptionT<T>> =>
		pipe(
			existsSync(filePath),
			IOEither.chain((exists) =>
				match(exists)
					.with(true, () =>
						pipe(fn(filePath), IOEither.map(Option.fromNullable))
					)
					.otherwise(() => IOEither.right(Option.none))
			)
		);

export const rmSync =
	(options?: RmOptions) =>
	(filePath: string): IOTryT<void> =>
		IOTry.tryCatch(() => fs.rmSync(filePath, options));

export const rmIfExistsSync =
	(options?: RmOptions) =>
	(filePath: string): IOTryT<void> =>
		pipe(
			filePath,
			doIfExistsSync(() => rmSync(options)(filePath)),
			IOEither.map(Option.fold(constVoid, constVoid))
		);

export const mkdirSync = (filePath: string): IOTryT<string> =>
	pipe(
		IOTry.tryCatch(() =>
			fs.mkdirSync(filePath, {
				recursive: true
			})
		),
		IOEither.chain((value) =>
			pipe(
				Option.fromNullable(value),
				Option.fold(
					() =>
						IOEither.left(
							new Error(`Failed to create directory: ${filePath}`)
						),
					(value) => IOEither.right(value)
				)
			)
		)
	);

export const listFilesSync = (
	filePath: string
): IOTryT<ReadonlyArray<string>> =>
	IOTry.tryCatch(() => RArr.fromArray(fs.readdirSync(filePath)));
