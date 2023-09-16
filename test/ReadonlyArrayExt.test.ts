import { describe, it, expect } from 'vitest';
import * as RArrayExt from '../src/ReadonlyArrayExt';

interface Person {
	readonly id: number;
	readonly name: string;
	readonly age: number;
}

const array: ReadonlyArray<Person> = [
	{
		id: 1,
		name: 'Bob',
		age: 20
	},
	{
		id: 2,
		name: 'John',
		age: 30
	},
	{
		id: 3,
		name: 'Carl',
		age: 40
	}
];

describe('ReadonlyArrayExt', () => {
	describe('dropFirstMatch', () => {
		it('drops the match', () => {
			const result = RArrayExt.dropFirstMatch<Person>((_) => _.id === 2)(
				array
			);
			expect(result).toHaveLength(2);
			expect(result).toEqual([
				{
					id: 1,
					name: 'Bob',
					age: 20
				},
				{
					id: 3,
					name: 'Carl',
					age: 40
				}
			]);
		});

		it('has no match', () => {
			const result = RArrayExt.dropFirstMatch<Person>((_) => _.id === 5)(
				array
			);
			expect(result).toHaveLength(3);
			expect(result).toEqual(array);
		});
	});

	describe('updateFirstMatch', () => {
		it('updates the match', () => {
			const result = RArrayExt.updateFirstMatch<Person>(
				(_) => _.id === 2,
				(_) => ({
					..._,
					name: 'Jose'
				})
			)(array);
			expect(result).toHaveLength(3);
			expect(result).toEqual([
				{
					id: 1,
					name: 'Bob',
					age: 20
				},
				{
					id: 2,
					name: 'Jose',
					age: 30
				},
				{
					id: 3,
					name: 'Carl',
					age: 40
				}
			]);
		});

		it('has no match', () => {
			const result = RArrayExt.updateFirstMatch<Person>(
				(_) => _.id === 5,
				(_) => ({
					..._,
					name: 'Jose'
				})
			)(array);
			expect(result).toHaveLength(3);
			expect(result).toEqual(array);
		});
	});
});
