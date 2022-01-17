// TODO use fp-ts Task instead of directly returning a Promise
export const sleep = (millis: number): Promise<void> =>
	new Promise((resolve) => setTimeout(resolve, millis));
