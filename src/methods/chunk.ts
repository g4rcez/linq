import { reduce } from "./reduce";

/*
  * @param array: the list to apply chunks
  * @param size: the size of each chunk
  * @returns array with arrays and the length as the same of `size`
 */
export const chunk = <T>(array: T[], size: number) =>
  reduce(
    (arr, item, index) => (index % size === 0 ? [...arr, [item]] : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]]),
    [] as T[][],
    array
  );
