import { isObject } from "./utils";

export const deepClone = <T extends unknown>(obj: any): T => {
  if (obj === null) {
    return null as T;
  }
  let clone = Object.assign({}, obj);
  Object.keys(clone).forEach((key) => (clone[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key]));
  return Array.isArray(obj) && obj.length
    ? (clone.length = obj.length) && Array.from(clone)
    : Array.isArray(obj)
    ? Array.from(obj)
    : clone;
};
