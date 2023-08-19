import { filter } from "./filter";
import { equals, isObject } from "./utils";

export const distinct = <T>(array: T[]) =>
  filter(array, (el, index, array) =>
    isObject(el) ? index === array.findIndex((obj: unknown) => equals(obj, el)) : index === array.indexOf(el),
  );
