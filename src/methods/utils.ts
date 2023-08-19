import { ObjectMap } from "./typing";

export const isObject = (a: any): a is Object => typeof a === "object";

export const equals = (a: any, b: any): boolean => {
  if (a === b) {
    return true;
  }
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  if (!a || !b || (!isObject(a) && !isObject(b))) {
    return a === b;
  }
  if (a.prototype !== b.prototype) {
    return false;
  }
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) {
    return false;
  }
  return keys.every((k) => equals(a[k], b[k]));
};


export const getKey = <T>(obj: any, key?: any): T => {
  if ((isObject(obj) || Array.isArray(obj)) && !!key) {
    return obj[key];
  }
  return obj;
};

export const sortBy = (key: string) => (a: ObjectMap, b: ObjectMap) => {
  if (a[key] === b[key]) {
    return 0;
  }
  return a[key] > b[key] ? 1 : -1;
};

export const isNumber = (a: string) => /[0-9.]+/.test(a);

export const isNumberOrString = (o: unknown): o is string | number => ["string", "number"].includes(typeof o);
