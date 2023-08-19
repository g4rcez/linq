export const reduce = <T, I>(
  callback: (acc: I, current: T, index: number, array: T[]) => unknown,
  initial: I,
  array: T[],
) => {
  let accumulator = initial;
  const len = array.length;
  for (let index = 0; index < len; index++) {
    const element = array[index];
    accumulator = callback(accumulator, element, index, array) as any;
  }
  return accumulator;
};
