import type { ArrayAsObj } from "./typing";

/*
 * @param array: the list to convert into a dictionary key:value
 * @param key: the key for each dictionary element
 * @returns the `array` filtered by `callback`
 */
export const dict = <T, K extends keyof T>(array: T[], key: K): ArrayAsObj<T> => {
  const map = new Map(array.map((x) => [x[key], x]));
  return Object.fromEntries(map.entries());
};
