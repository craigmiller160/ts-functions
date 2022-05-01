import * as Regex from './Regex';
import { P } from 'ts-pattern';
import { GuardP } from 'ts-pattern/dist/types/Pattern';

export const regex = (reg: RegExp | string): GuardP<string, boolean> =>
	P.when(Regex.test(reg));

export const lengthGT = (
	value: number
): GuardP<string | Array<unknown>, boolean> => P.when((_) => _.length > value);

export const lengthGTE = (
	value: number
): GuardP<string | Array<unknown>, boolean> => P.when((_) => _.length >= value);

export const lengthEQ = (
	value: number
): GuardP<string | Array<unknown>, boolean> =>
	P.when((_) => _.length === value);

export const lengthLT = (
	value: number
): GuardP<string | Array<unknown>, boolean> => P.when((_) => _.length < value);

export const lengthLTE = (
	value: number
): GuardP<string | Array<unknown>, boolean> => P.when((_) => _.length <= value);
