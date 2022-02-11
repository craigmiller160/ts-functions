import { IOT } from './types';

export const cwd = (): IOT<string> => () => process.cwd();
