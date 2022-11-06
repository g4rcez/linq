import { ArrayCallbackAssertion } from "./typing";

export const all = <T>(callback: ArrayCallbackAssertion<T>, array: T[]) => {
  for (let index = 0; index < array.length; index++) {
    const includes = callback(array[index] as T, index, array);
    if (!includes) {
      return false;
    }
  }
  return true;
};
