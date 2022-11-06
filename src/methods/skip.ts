import { ArrayCallbackAssertion } from "./typing";

export const skip = <T>(jumps: number | ArrayCallbackAssertion<T>, array: T[]) => {
  if (typeof jumps === "number") {
    return array.slice(jumps);
  }
  let len = array.length;
  for (let index = 0; index < len; index++) {
    const element = array[index];
    const assertion = jumps(element, index, array);
    if (assertion) {
      return array.slice(index);
    }
  }
  return array.slice(0);
};
