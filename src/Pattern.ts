export const lengthGT =
	(length: number) =>
	(value: string): boolean =>
		value.length > length;

export const lengthGTE =
	(length: number) =>
	(value: string): boolean =>
		value.length >= length;

export const lengthEQ =
	(length: number) =>
	(value: string): boolean =>
		value.length === length;

export const lengthLT =
	(length: number) =>
	(value: string): boolean =>
		value.length < length;

export const lengthLTE =
	(length: number) =>
	(value: string): boolean =>
		value.length <= length;
