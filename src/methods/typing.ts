export type OrderKeys = "desc" | "asc";

export type Symbols = "==" | "===" | ">" | ">=" | "<" | "<=" | "eq" | "like" | "is" | "!==" | "!=" | "alphabetical";

export type ObjectMap = { [key: string]: any };

export type Grouped<T> = { [K in keyof T]: T[K][] };

export type WhereFunction<T, V> = (value: T, compare: V, index: number, array: T[]) => boolean;

export type SymbolMap<T, V> = { [key in Symbols]: WhereFunction<T, V> };

export type ArrayCallback<T> = (item: T, index: number, array: T[]) => T;

export type ArrayCallbackAssertion<T> = (item: T, index: number, array: T[]) => boolean;

export type Reducer<Initial, T> = (acc: Initial, current: T, index: number, array: T[]) => Initial;

export type Maybe<T> = T | null | undefined;

export type ArrayAsObj<T> = { [key in keyof T]: T };

export type AggregateType = <T>(
  firstValue: T,
  fn: (next: T, accumulator: T) => T,
  array: T[],
  transform: (val: T) => unknown
) => any;

export type ChunkType = (<T>(chunk: number, array: T[]) => T[][]) & ((chunk: number) => <T>(array: T[]) => T[][]);

export type RangeType = ((first: string) => string[]) &
  ((first: string, second: string) => string[]) &
  ((first: number, second: number) => number[]) &
  ((length: number, steps: number) => number[]) &
  ((first: number, second: number, steps: number) => number[]);

export type ReduceType = (<T, Initial>(callback: Reducer<Initial, T>, initial: Initial, array: T[]) => Initial) &
  (<T, Initial>(callback: Reducer<Initial, T>) => (initial: Initial, array: T[]) => Initial) &
  (<T, Initial>(callback: Reducer<Initial, T>) => (initial: Initial) => (array: T[]) => Initial);

export type EveryType = <T>(callback: ArrayCallbackAssertion<T>, array: T[]) => boolean;

export type MapType = (<T>(callback: ArrayCallback<T>) => (array: T[]) => any[]) &
  (<T>(callback: ArrayCallback<T>, array: T[]) => never[]);

export type FilterType = (<T>(callback: ArrayCallbackAssertion<T>, array: T[]) => T[]) &
  (<T>(callback: ArrayCallbackAssertion<T>) => (array: T[]) => T[]);

export type GroupByType = (<T>(key: keyof T, array: T[]) => Grouped<T>) &
  (<T>(key: keyof T) => (array: T[]) => Grouped<T>);

export type FindType = (<T>(callback: ArrayCallbackAssertion<T>, array: T[]) => T | null) &
  (<T>(callback: ArrayCallbackAssertion<T>) => (array: T[]) => T | null);

export type SortParameters<T> = ((a: T, b: T) => number) | undefined | keyof T;

export type SortType = (<T>(array: T[], sorterOrKey?: SortParameters<T>) => T[]) & (<T>(array: T[]) => T[]);

export type WhereType = (<T>(callback: ArrayCallback<T>) => (array: T[]) => any[]) &
  (<T>(callback: ArrayCallback<T>, array: T[]) => never[]);

export type Repeat = (<T>(element: T, repeat: number) => T[]) & (<T>(element: T) => (repeat: number) => T[]);

export type MathNumber = (<T>(element: keyof T, array: T[]) => number) & ((array: number[]) => number);

export type Unique = (<T>(array: T[], key?: keyof T) => T[]) & (<T>(array: T[]) => T[]);
