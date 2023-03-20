import { filter } from "./filter";
import { ArrayCallbackAssertion, Maybe, SymbolMap, Symbols } from "./typing";
import { equals, getKey } from "./utils";

const symbolMap: SymbolMap<any, any> = {
  eq: equals,
  is: Object.is,
  "!=": (value, compare) => value != compare,
  "!==": (value, compare) => value !== compare,
  "<": (value, compare) => value < compare,
  "<=": (value, compare) => value <= compare,
  "==": (value, compare) => value == compare,
  "===": (value, compare) => value === compare,
  ">": (value, compare) => value > compare,
  ">=": (value, compare) => value >= compare,
  like: (value: string | number, compare: string | number) => new RegExp(`${compare}`, "g").test(`${value}`),
  alphabetical: (v, c) => v.toString().localeCompare(c.toString()),
};

export const GetOperationFromSymbol = (symbol: Symbols) => {
  if (symbol in symbolMap) {
    return symbolMap[symbol];
  }
  throw new Error("Linq - Symbol not found");
};

export function where<T>(
  array: T[],
  args?: ArrayCallbackAssertion<T> | Maybe<keyof T>,
  symbol?: Symbols,
  value?: unknown
) {
  if (typeof args === "function") {
    return array.filter(args);
  }
  const op = GetOperationFromSymbol(symbol!);
  if (!!args && !!symbol && value !== undefined) {
    return filter((x, i, array) => op(getKey(x, args), value, i, array), array);
  }
  return filter((x, i, array) => op(x, value, i, array), array);
}
