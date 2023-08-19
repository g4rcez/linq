import type { ArrayCallbackAssertion } from "./typing";

/*
 * @param array: the list to find the `element`
 * @param callback: the function that find the element
 * @returns undefined or the found element
 */
export const find = <T>(array: T[], callback: ArrayCallbackAssertion<T>) => {
  const len = array.length;
  for (let index = 0; index < len; index++) {
    const includes = callback(array[index] as T, index, array);
    if (includes) {
      return array[index] as T;
    }
  }
  return undefined;
};
