// TODO write test
export const split =
	(delimiter: string) =>
	(text: string): string[] =>
		text.split(delimiter);

// TODO write test
export const combine = (delimiter: string) => (s1: string, s2: string) =>
	`${s1}${delimiter}${s2}`;
