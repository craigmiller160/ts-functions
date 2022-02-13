import * as Regex from './Regex';
import { when } from 'ts-pattern';
import { GuardPattern } from 'ts-pattern/lib/types/Pattern';

export const regex = (reg: RegExp | string): GuardPattern<string> =>
	when(Regex.test(reg));

export const lengthGT = (
	value: number
): GuardPattern<string | Array<unknown>> => when((_) => _.length > value);

export const lengthGTE = (
	value: number
): GuardPattern<string | Array<unknown>> => when((_) => _.length >= value);

export const lengthEQ = (
	value: number
): GuardPattern<string | Array<unknown>> => when((_) => _.length === value);

export const lengthLT = (
	value: number
): GuardPattern<string | Array<unknown>> => when((_) => _.length < value);

export const lengthLTE = (
	value: number
): GuardPattern<string | Array<unknown>> => when((_) => _.length <= value);
