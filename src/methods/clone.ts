import { isObject } from "./utils";

/*
 * @param array: the list to apply chunks
 * @param size: the size of each chunk
 * @returns array with arrays and the length as the same of `size`
 */
export const deepClone = <T extends unknown>(obj: any): T => {
  if (obj === null) {
    return null as T;
  }
  const clone = { ...obj };
  Object.keys(clone).forEach((key) => (clone[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key]));
  return Array.isArray(obj) && obj.length
    ? (clone.length = obj.length) && Array.from(clone)
    : Array.isArray(obj)
      ? Array.from(obj)
      : clone;
};
