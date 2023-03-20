import { deepClone } from "./clone";
import { ObjectMap } from "./typing";

export const isObject = (a: any): a is Object => typeof a === "object";
export const isFunction = (a: any): a is Function => typeof a === "function";

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

const primitives = ["bigint", "boolean", "number", "string"];

const isPrimitive = (e: unknown) => primitives.includes(typeof e);

export const spreadData = (item: unknown) => {
  if (isPrimitive(item)) {
    return item;
  }
  return deepClone(item);
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

const isNumber = (a: string) => /[0-9.]+/.test(a);

const individualChars = (charA: string, charZ: string, jumps = 1) => {
  const a = [];
  let i = charA.charCodeAt(0);
  const j = charZ.charCodeAt(0);
  for (; i <= j; i += jumps) {
    a.push(String.fromCharCode(i));
  }
  if (isNumber(charA) && isNumber(charZ)) {
    return a.map((x) => Number.parseInt(x));
  }
  return a;
};

const getInSequence = (a: string, b: string): [number, number] => {
  let x = Number.parseInt(a, 10);
  let y = Number.parseInt(b, 10);
  return x > y ? [y, x] : [x, y];
};

export const createChars = (charA: string, charZ: string, jumps = 1) => {
  let abs = Math.abs(jumps);
  if (charA.length > 1 || charZ.length > 1) {
    if (isNumber(charA) && isNumber(charZ)) {
      const a = [];
      const [first, second] = getInSequence(charA, charZ);
      for (let i = first; i <= second; i += abs) {
        a.push(i);
      }
      return a;
    }
  }
  return individualChars(charA, charZ, abs);
};

export const isNumberOrString = (o: unknown): o is string | number => ["string", "number"].includes(typeof o);
