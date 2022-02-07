import fs from 'fs';
import * as Try from './Try';
import * as Either from 'fp-ts/Either';
import * as Option from 'fp-ts/Option';
import { flow, identity, pipe } from 'fp-ts/function';
import * as RArr from 'fp-ts/ReadonlyArray';
import { TryT } from './types';

export const readFileSync = (
	filePath: string,
	encoding: BufferEncoding = 'utf8'
): TryT<string> => Try.tryCatch(() => fs.readFileSync(filePath, encoding));

export const writeFileSync = (filePath: string, content: string): TryT<void> =>
	Try.tryCatch(() => fs.writeFileSync(filePath, content));

export const appendFileSync = (filePath: string, content: string): TryT<void> =>
	Try.tryCatch(() => fs.appendFileSync(filePath, content));

export const existsSync =
	<T>(fn: (filePath: string) => T) =>
	(filePath: string): Option.Option<T> => {
		if (fs.existsSync(filePath)) {
			return Option.fromNullable(fn(filePath));
		}
		return Option.none;
	};

type RmIfExistsSync = (filePath: string) => TryT<unknown>;
export const rmIfExistsSync: RmIfExistsSync = flow(
	existsSync((path) =>
		Try.tryCatch(() =>
			fs.rmSync(path, {
				recursive: true,
				force: true
			})
		)
	),
	Option.fold<TryT<void>, TryT<unknown>>(() => Either.right(null), identity)
);

export const mkdirSync = (filePath: string): TryT<string> =>
	pipe(
		Try.tryCatch(() =>
			fs.mkdirSync(filePath, {
				recursive: true
			})
		),
		Either.chain((value) =>
			pipe(
				Option.fromNullable(value),
				Option.fold(
					() =>
						Either.left(
							new Error(`Failed to create directory: ${filePath}`)
						),
					(value) => Either.right(value)
				)
			)
		)
	);

export const listFilesSync = (filePath: string): TryT<ReadonlyArray<string>> =>
	Try.tryCatch(() => RArr.fromArray(fs.readdirSync(filePath)));
