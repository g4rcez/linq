import { equals, isObject } from "./utils";

/*
  * @param array: the list to verify if `element` exists in
  * @param element: the element to check if exists in `array`
  * @returns boolean if the `element` exists in `array`
 */
export const contains = <T, K extends T | keyof T>(array: T[], element: K) => {
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
