export type OrderKeys = "desc" | "asc";

export type Symbols = "==" | "===" | ">" | ">=" | "<" | "<=" | "eq" | "like" | "is" | "!==" | "!=";

export type ObjectMap = { [key: string]: never };

export type Grouped<GENERICS> = { [K in keyof GENERICS]: GENERICS[K][] };

export type WhereFunction<T, V> = (value: T, compare: V, index: number, array: T[]) => boolean;

export type SymbolMap<T, V> = { [key in Symbols]: WhereFunction<T, V> };

export type ArrayCallback<T> = (item: T, index: number, array: T[]) => T;

export type ArrayCallbackAssertion<T> = (item: T, index: number, array: T[]) => boolean;

export type Reducer<Initial, GENERICS> = (acc: Initial, current: GENERICS, index: number, array: GENERICS[]) => Initial;

export type Maybe<T> = T | null | undefined;

export type ArrayAsObj<T> = { [key in keyof T]: T };

export type AggregateType = <T>(
	firstValue: T,
	fn: (next: T, accumulator: T) => T,
	array: T[],
	transform: (val: T) => unknown,
) => any;

export type ChunkType = (<GENERICS>(chunk: number, array: GENERICS[]) => GENERICS[][]) &
	((chunk: number) => <GENERICS>(array: GENERICS[]) => GENERICS[][]);

export type RangeType = ((first: string) => string[]) &
	((first: string, second: string) => string[]) &
	((first: number, second: number) => number[]) &
	((length: number, steps: number) => number[]) &
	((first: number, second: number, steps: number) => number[]);

export type ReduceType = (<GENERICS, Initial>(
	callback: Reducer<Initial, GENERICS>,
	initial: Initial,
	array: GENERICS[],
) => Initial) &
	(<GENERICS, Initial>(callback: Reducer<Initial, GENERICS>) => (initial: Initial, array: GENERICS[]) => Initial) &
	(<GENERICS, Initial>(callback: Reducer<Initial, GENERICS>) => (initial: Initial) => (array: GENERICS[]) => Initial);

export type EveryType = (<GENERICS>(callback: ArrayCallbackAssertion<GENERICS>, array: GENERICS[]) => boolean) &
	(<GENERICS>(callback: ArrayCallbackAssertion<GENERICS>) => (array: GENERICS[]) => boolean);

export type SomeType = (<T>(callback: ArrayCallbackAssertion<T>) => (array: T[]) => boolean) &
	(<T>(callback: ArrayCallbackAssertion<T>, array: T[]) => boolean);

export type MapType = (<T>(callback: ArrayCallback<T>) => (array: T[]) => any[]) &
	(<T>(callback: ArrayCallback<T>, array: T[]) => never[]);

export type FilterType = (<GENERICS>(callback: ArrayCallbackAssertion<GENERICS>, array: GENERICS[]) => GENERICS[]) &
	(<GENERICS>(callback: ArrayCallbackAssertion<GENERICS>) => (array: GENERICS[]) => GENERICS[]);

export type GroupByType = (<GENERICS>(key: keyof GENERICS, array: GENERICS[]) => Grouped<GENERICS>) &
	(<GENERICS>(key: keyof GENERICS) => (array: GENERICS[]) => Grouped<GENERICS>);

export type FindType = (<GENERICS>(callback: ArrayCallbackAssertion<GENERICS>, array: GENERICS[]) => GENERICS | null) &
	(<GENERICS>(callback: ArrayCallbackAssertion<GENERICS>) => (array: GENERICS[]) => GENERICS | null);

export type SortParameters<GENERICS> = ((a: GENERICS, b: GENERICS) => number) | undefined | keyof GENERICS;

export type SortType = (<GENERICS>(array: GENERICS[], sorterOrKey?: SortParameters<GENERICS>) => GENERICS[]) &
	(<GENERICS>(array: GENERICS[]) => GENERICS[]);

export type WhereType = (<T>(callback: ArrayCallback<T>) => (array: T[]) => any[]) &
	(<T>(callback: ArrayCallback<T>, array: T[]) => never[]);

export type Repeat = (<GENERICS>(element: GENERICS, repeat: number) => GENERICS[]) &
	(<GENERICS>(element: GENERICS) => (repeat: number) => GENERICS[]);

export type MathNumber = (<GENERICS>(element: keyof GENERICS, array: GENERICS[]) => number) &
	((array: number[]) => number);

export type Unique = (<T>(array: T[], key?: keyof T) => T[]) & (<T>(array: T[]) => T[]);
