import { Props, Type } from 'io-ts';
import * as ioType from 'io-ts';
import { identity } from 'fp-ts/function';

export class NaNType extends Type<typeof Number.NaN> {
	constructor() {
		super(
			'NaN',
			(u): u is typeof NaN => Number.isNaN(u),
			(u, c) => (this.is(u) ? ioType.success(u) : ioType.failure(u, c)),
			identity
		);
	}
}

export const typeNaN = new NaNType();

export const readonlyType = <P extends Props>(
	props: P
): ioType.ReadonlyC<ioType.TypeC<P>> => ioType.readonly(ioType.type(props));
