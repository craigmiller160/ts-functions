import fs from 'fs';
import * as Try from './Try';
import * as Either from 'fp-ts/Either';
import * as Option from 'fp-ts/Option';
import { flow, identity } from 'fp-ts/function';

export const readFileSync = (
	filePath: string,
	encoding: BufferEncoding = 'utf8'
): Try.Try<string> => Try.tryCatch(() => fs.readFileSync(filePath, encoding));

export const existsSync =
	<T>(fn: (filePath: string) => T) =>
	(filePath: string): Option.Option<T> => {
		if (fs.existsSync(filePath)) {
			return Option.fromNullable(fn(filePath));
		}
		return Option.none;
	};

type RmIfExists = (filePath: string) => Try.Try<unknown>;
export const rmIfExists: RmIfExists = flow(
	existsSync((path) =>
		Try.tryCatch(() =>
			fs.rmSync(path, {
				recursive: true,
				force: true
			})
		)
	),
	Option.fold<Try.Try<void>, Try.Try<unknown>>(
		() => Either.right(null),
		identity
	)
);

// TODO mkdir

// TODO listFiles
