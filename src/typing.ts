export type OrderKeys = "desc" | "asc";

export type Symbols = "==" | "===" | ">" | ">=" | "<" | "<=" | "eq" | "is" | "!==" | "!=";

export type ObjectMap = { [key: string]: never };

export type Grouped<GENERICS> = { [K in keyof GENERICS]: GENERICS[K][] };

export type WhereFunction<T, V> = (value: T, compare: V, index: number, array: T[]) => boolean;

export type SymbolMap<T, V> = { [key in Symbols]: WhereFunction<T, V> };

export type ArrayCallback<T> = (item: T, index: number, array: T[]) => T;

export type ArrayCallbackAssertion<T> = (item: T, index: number, array: T[]) => boolean;

export type Reducer<Initial, GENERICS> = (acc: Initial, current: GENERICS, index: number, array: GENERICS[]) => Initial;

const primitiveTypes = ["number", "boolean", "string"];
export const isPrimitive = (some: never) => primitiveTypes.includes(typeof some);

export type AggregateType = (<T>(
	firstValue: T,
	fn: (next: T, accumulator: T) => T,
	array: T[],
	transform: (val: T) => unknown,
) => any) &
	(<T>(
		firstValue: T,
	) => (fn: (next: T, accumulator: T) => T) => (array: T[]) => (transform: (val: T) => unknown) => any) &
	(<T>(
		firstValue: T,
		fn: (next: T, accumulator: T) => T,
	) => (array: T[]) => (transform: (val: T) => unknown) => any) &
	(<T>(firstValue: T, fn: (next: T, accumulator: T) => T, array: T[]) => (transform: (val: T) => unknown) => any);

export type ChunkType = (<GENERICS>(chunk: number, array: GENERICS[]) => GENERICS[][]) &
	((chunk: number) => <GENERICS>(array: GENERICS[]) => GENERICS[][]);

export type RangeType = ((first: string, second: string) => string[]) &
	((first: string) => string[]) &
	((length: number, steps: number) => number[]);

export type ReduceType = (<GENERICS, Initial>(
	callback: Reducer<Initial, GENERICS>,
	initial: Initial,
	array: GENERICS[],
) => Initial) &
	(<GENERICS, Initial>(callback: Reducer<Initial, GENERICS>) => (initial: Initial, array: GENERICS[]) => Initial) &
	(<GENERICS, Initial>(callback: Reducer<Initial, GENERICS>) => (initial: Initial) => (array: GENERICS[]) => Initial);

export type EveryType = (<GENERICS>(callback: ArrayCallbackAssertion<GENERICS>, array: GENERICS[]) => boolean) &
	(<GENERICS>(callback: ArrayCallbackAssertion<GENERICS>) => (array: GENERICS[]) => boolean);
