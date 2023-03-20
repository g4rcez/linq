import { ArrayCallbackAssertion } from "./typing";
import { spreadData } from "./utils";

export const find = <T>(callback: ArrayCallbackAssertion<T>, array: T[]) => {
  const len = array.length;
  for (let index = 0; index < len; index++) {
    const includes = callback(array[index] as T, index, array);
    if (includes) {
      return spreadData(array[index]) as T;
    }
  }
  return undefined;
};
