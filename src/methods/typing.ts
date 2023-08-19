export type OrderKeys = "desc" | "asc";

export type Symbols =
  | "=="
  | "==="
  | ">"
  | ">="
  | "<"
  | "<="
  | "eq"
  | "like"
  | "is"
  | "!=="
  | "!="
  | "alphabetical"
  | "includes"
  | "notIncludes"
  | "startsWith"
  | "endsWith"
  | "empty"
  | "notEmpty"
  | "in"
  | "notIn";

export type ObjectMap = { [key: string]: any };

export type WhereFunction<T, V> = (value: T, compare: V, index: number, array: T[]) => boolean;

export type SymbolMap<T, V> = { [key in Symbols]: (value: T, compare: V) => boolean };

export type ArrayCallback<T> = (item: T, index: number, array: T[]) => T;

export type ArrayCallbackAssertion<T> = (item: T, index: number, array: T[]) => boolean;

export type Maybe<T> = T | null | undefined;

export type ArrayAsObj<T> = { [key in keyof T]: T };

export type SortParameters<T> = ((a: T, b: T) => number) | undefined | keyof T;
