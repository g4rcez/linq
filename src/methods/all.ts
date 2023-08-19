import type { ArrayCallbackAssertion } from "./typing";

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
