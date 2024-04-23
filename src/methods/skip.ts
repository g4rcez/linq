import { ArrayCallbackAssertion, Symbols } from "./typing";
import { whereSymbol } from "./where";

export const skip = <T>(array: T[], jumps: ArrayCallbackAssertion<T> | number) => {
  if (typeof jumps === "number") {
    return array.slice(jumps);
  }
  let len = array.length;
  for (let index = 0; index < len; index++) {
    const element = array[index];
    const assertion = jumps(element, index, array);
    if (assertion) {
      return array.slice(index);
    }
  }
  return array.slice(0);
};

export const skipLikeWhere = <T extends unknown>(
  array: T[],
  args: ArrayCallbackAssertion<T> | number,
  symbol?: Symbols,
  value?: unknown
) => whereSymbol<T, T[]>(skip, array, args as any, symbol, value);
