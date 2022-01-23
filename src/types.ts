import { ReaderEither } from 'fp-ts/ReaderEither';
import { ReaderTaskEither } from 'fp-ts/ReaderTaskEither';

export type { TaskTry as TaskTryT } from './TaskTry';
export type { Try as TryT } from './Try';
export type ReaderTry<D, T> = ReaderEither<D, Error, T>;
export type ReaderTaskTry<D, T> = ReaderTaskEither<D, Error, T>;
