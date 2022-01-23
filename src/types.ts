import { ReaderEither } from 'fp-ts/ReaderEither';
import { ReaderTaskEither } from 'fp-ts/ReaderTaskEither';

export type { TaskTry as TaskTryT } from './TaskTry';
export type { Try as TryT } from './Try';
export type ReaderTryT<D, T> = ReaderEither<D, Error, T>;
export type ReaderTaskTryT<D, T> = ReaderTaskEither<D, Error, T>;
export type { Option as OptionT } from 'fp-ts/Option';
export type { Either as EitherT } from 'fp-ts/Either';
export type { TaskEither as TaskEitherT } from 'fp-ts/TaskEither';
export type { Reader as ReaderT } from 'fp-ts/Reader';
export type ReaderEitherT<D, E, T> = ReaderEither<D, E, T>;
export type ReaderTaskEitherT<D, E, T> = ReaderTaskEither<D, E, T>;
export type { Task as TaskT } from 'fp-ts/Task';
