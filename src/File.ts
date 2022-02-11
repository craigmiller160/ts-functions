import fs from 'fs';
import * as Option from 'fp-ts/Option';
import { flow, identity, pipe } from 'fp-ts/function';
import * as RArr from 'fp-ts/ReadonlyArray';
import { IOTryT, OptionT } from './types';
import * as IOTry from './IOTry';
import * as IOEither from 'fp-ts/IOEither';

export const readFileSync = (
	filePath: string,
	encoding: BufferEncoding = 'utf8'
): IOTryT<string> => IOTry.tryCatch(() => fs.readFileSync(filePath, encoding));

export const writeFileSync = (
	filePath: string,
	content: string
): IOTryT<void> => IOTry.tryCatch(() => fs.writeFileSync(filePath, content));

export const appendFileSync = (
	filePath: string,
	content: string
): IOTryT<void> => IOTry.tryCatch(() => fs.appendFileSync(filePath, content));

// TODO think about types for this one
export const existsSync =
	<T>(fn: (filePath: string) => T) =>
	(filePath: string): OptionT<T> => {
		if (fs.existsSync(filePath)) {
			return Option.fromNullable(fn(filePath));
		}
		return Option.none;
	};

export const rmIfExistsSync: (filePath: string) => IOTryT<unknown> = flow(
	existsSync((path) =>
		IOTry.tryCatch(() =>
			fs.rmSync(path, {
				recursive: true,
				force: true
			})
		)
	),
	Option.fold<IOTryT<void>, IOTryT<unknown>>(
		() => IOEither.right(null),
		identity
	)
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
