import * as Task from 'fp-ts/Task';

export const sleep =
	(millis: number): Task.Task<void> =>
	() =>
		new Promise((resolve) => setTimeout(resolve, millis));

export const immediate = (): Task.Task<void> => () =>
	new Promise((resolve) => setImmediate(resolve));
