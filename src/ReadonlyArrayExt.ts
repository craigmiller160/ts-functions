import { PredicateT } from './types';

export const dropFirstMatch =
	<T>(predicate: PredicateT<T>) =>
	(arr: ReadonlyArray<T>): ReadonlyArray<T> => {
		const index = arr.findIndex(predicate);
		if (index < 0) {
			return arr;
		}
		return arr.slice(0, index).concat(arr.slice(index + 1));
	};

export const updateFirstMatch =
	<T>(predicate: PredicateT<T>, updateMatch: (t: T) => T) =>
	(arr: ReadonlyArray<T>): ReadonlyArray<T> => {
		const index = arr.findIndex(predicate);
		if (index < 0) {
			return arr;
		}
		const newItem = updateMatch(arr[index]);
		const newArr = [...arr];
		newArr[index] = newItem;
		return newArr;
	};

export const toMutable = <T>(arr: ReadonlyArray<T>): Array<T> =>
	arr as Array<T>;
