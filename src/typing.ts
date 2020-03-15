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
