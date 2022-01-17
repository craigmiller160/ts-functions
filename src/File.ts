import fs from 'fs';
import * as Try from './Try';
import { flow } from 'fp-ts/function';

export const readFileSync = (
	filePath: string,
	encoding: BufferEncoding = 'utf8'
): Try.Try<string> => Try.tryCatch(() => fs.readFileSync(filePath, encoding));

export const existsSync =
	<T>(fn: (filePath: string) => T) =>
	(filePath: string): T | null => {
		if (fs.existsSync(filePath)) {
			return fn(filePath);
		}
		return null;
	};

type RmIfExists = (filePath: string) => Try.Try<void> | null;
export const rmIfExists: RmIfExists = flow(
	existsSync((path) =>
		Try.tryCatch(() =>
			fs.rmSync(path, {
				recursive: true,
				force: true
			})
		)
	)
);

// TODO mkdir

// TODO listFiles
