import type { ArrayAsObj } from "./typing";

/*
 * @param array: the list to convert into a dictionary key:value
 * @param key: the key for each dictionary element
 * @returns an object keyed by the selected element property
 */
export const dict = <T, K extends keyof T>(array: T[], key: K): ArrayAsObj<T> => {
  const entries = new Map<PropertyKey, T>();
  for (const item of array) entries.set(item[key] as unknown as PropertyKey, item);
  return Object.fromEntries(entries) as ArrayAsObj<T>;
};
