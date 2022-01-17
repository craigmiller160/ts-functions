import * as Regex from './Regex';
import { when } from 'ts-pattern';
import { GuardPattern } from 'ts-pattern/lib/types/Pattern';

export const regex = (reg: RegExp | string): GuardPattern<string> =>
	when((str: string) => Regex.test(reg)(str));
