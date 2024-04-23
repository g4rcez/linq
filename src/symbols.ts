import { all } from "./methods/all";
import { any } from "./methods/any";
import { SymbolMap, Symbols } from "./methods/typing";
import { equals } from "./methods/utils";

const isEmpty = (v: any) => v === undefined || v === null || v?.length === 0 || v === "";

const symbolMap: SymbolMap<any, any> = {
  eq: equals,
  is: Object.is,
  "!=": (v, c) => v != c,
  "!==": (v, c) => v !== c,
  "<": (v, c) => v < c,
  "<=": (v, c) => v <= c,
  "==": (v, c) => v == c,
  "===": (v, c) => v === c,
  ">": (v, c) => v > c,
  ">=": (v, c) => v >= c,
  includes: (v, c) => `${v}`.includes(c),
  notIncludes: (v, c) => !`${v}`.includes(c),
  startsWith: (v, c) => `${v}`.startsWith(c),
  endsWith: (v, c) => `${v}`.endsWith(c),
  like: (v, c) => new RegExp(`.*${c}.*`, "gi").test(`${v}`),
  alphabetical: (v, c) => v.toString().localeCompare(c.toString()),
  empty: isEmpty,
  notEmpty: (x) => !isEmpty(x),
  in: (v, c) => any(c, (x) => equals(v, x)),
  notIn: (v, c) => all(c, (x) => !equals(v, x)),
};

export const GetOperationFromSymbol = (symbol: Symbols) => {
  if (symbol in symbolMap) return symbolMap[symbol];
  throw new Error("Linq - Symbol not found");
};

