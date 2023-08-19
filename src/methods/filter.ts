import { ArrayCallbackAssertion } from "./typing";

/*
 * @param array: the list to filter
 * @param callback: the function that return a boolean. True for maintain in list, false to remove
 * @returns the `array` filtered by `callback`
 */
export const filter = <T>(array: T[], callback: ArrayCallbackAssertion<T>) => {
  const mappedArray = [];
  const len = array.length;
  for (let index = 0; index < len; index++) {
    const includes = callback(array[index] as T, index, array);
    if (includes) {
      mappedArray.push(array[index] as T);
    }
  }
  return mappedArray;
};
