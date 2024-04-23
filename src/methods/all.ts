import { ArrayCallbackAssertion, Maybe, Symbols } from "./typing";
import { whereSymbol } from "./where";

/*
 * @param array: the list to apply `all` logic
 * @param callback: the callback for each item of `array`
 * @returns Boolean, if all items are ok for callback, return true. False if at least one return false
 */
export const all = <T>(array: T[], callback: ArrayCallbackAssertion<T>) => {
  for (let index = 0; index < array.length; index++) {
    const includes = callback(array[index] as T, index, array);
    if (!includes) {
      return false;
    }
  }
  return true;
};

export const allLikeWhere = <T extends unknown>(
  array: T[],
  args?: ArrayCallbackAssertion<T> | Maybe<keyof T>,
  symbol?: Symbols,
  value?: unknown
) => whereSymbol<T, boolean>(all, array, args, symbol, value);
