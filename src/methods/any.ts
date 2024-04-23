import { all } from "./all";
import { ArrayCallbackAssertion, Maybe, Symbols } from "./typing";
import { whereSymbol } from "./where";

/*
 * @param array: the list to apply `any` logic
 * @param callback: the callback for each item of `array`
 * @returns Boolean, if at least one is ok for callback, return true. False if at least one return false
 */
export const any = <T>(array: T[], callback: ArrayCallbackAssertion<T>) => {
  const len = array.length;
  for (let index = 0; index < len; index++) {
    const includes = callback(array[index] as T, index, array);
    if (includes) {
      return true;
    }
  }
  return false;
};

export const anyLikeWhere = <T extends unknown>(
  array: T[],
  args?: ArrayCallbackAssertion<T> | Maybe<keyof T>,
  symbol?: Symbols,
  value?: unknown
) => whereSymbol<T, boolean>(any, array, args, symbol, value);
