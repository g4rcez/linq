import { ArrayCallbackAssertion } from "./typing";

export const filter = <T>(callback: ArrayCallbackAssertion<T>, array: T[]) => {
  const mappedArray = [];
  const len = array.length;
  for (let index = 0; index < len; index++) {
    const includes = callback(array[index] as T, index, array);
    if (includes) {
      mappedArray.push(array[index] as T);
    }
  }
  return mappedArray;
};

export const compact = <T>(array: T[]) => {
  const mappedArray = [];
  const len = array.length;
  for (let index = 0; index < len; index++) {
    const element = array[index];
    if (Boolean(element)) {
      mappedArray.push(array[index] as T);
    }
  }
  return mappedArray;
};
