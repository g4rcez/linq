import { equals, isObject } from "./utils";

export const contains = <T>(element: T | keyof T, array: T[]) => {
  if (isObject(element)) {
    for (let index = 0; index < array.length; index++) {
      const current = array[index];
      if (equals(element, current)) {
        return true;
      }
    }
    return false;
  }
  for (let index = 0; index < array.length; index++) {
    const current = array[index];
    if (equals(element, current)) {
      return true;
    }
  }
  return false;
};
