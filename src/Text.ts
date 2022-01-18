export const split =
	(delimiter: string) =>
	(text: string): string[] =>
		text.split(delimiter);

export const concat = (delimiter: string) => (s1: string, s2: string) =>
	`${s1}${delimiter}${s2}`;
