import { filter } from "./filter";
import { equals, isObject } from "./utils";

export const distinct = <T>(array: T[]) => {
  return filter((el, index, array) => {
    if (isObject(el)) {
      return index === array.findIndex((obj: unknown) => equals(obj, el));
    }
    return index === array.indexOf(el);
  }, array);
};
