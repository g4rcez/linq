export type OrderKeys = "desc" | "asc";

export type Symbols = "==" | "===" | ">" | ">=" | "<" | "<=" | "eq" | "like" | "is" | "!==" | "!=" | "alphabetical";

export type ObjectMap = { [key: string]: any };

export type Grouped<T> = { [K in keyof T]: T[K][] };

export type WhereFunction<T, V> = (value: T, compare: V, index: number, array: T[]) => boolean;

export type SymbolMap<T, V> = { [key in Symbols]: WhereFunction<T, V> };

export type ArrayCallback<T> = (item: T, index: number, array: T[]) => T;

export type ArrayCallbackAssertion<T> = (item: T, index: number, array: T[]) => boolean;

export type Maybe<T> = T | null | undefined;

export type ArrayAsObj<T> = { [key in keyof T]: T };

export type SortParameters<T> = ((a: T, b: T) => number) | undefined | keyof T;
