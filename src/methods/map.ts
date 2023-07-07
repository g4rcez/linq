import { ArrayCallback } from "./typing";

/*
  * @param array: the list to transform
  * @param callback: the function that takes an item and transform to something
  * @returns the transformed list
 */
export const map = <T>(array: T[], callback: ArrayCallback<T>) => {
  const mappedArray = [];
  let index = 0;
  const len = array.length;
  for (index; index < len; index++) {
    const transform = callback(array[index] as T, index, array);
    mappedArray.push(transform as T);
  }
  return mappedArray;
};
