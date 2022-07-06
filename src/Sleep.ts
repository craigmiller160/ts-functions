import * as Task from 'fp-ts/Task';

export const sleep =
	(millis: number): Task.Task<void> =>
	() =>
		new Promise((resolve) => setTimeout(resolve, millis));

// setImmediate is not as portable as setTimeout so this is a better solution
export const immediate: Task.Task<void> = () =>
	new Promise((resolve) => setTimeout(resolve, 1));
