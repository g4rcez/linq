/*
  * @param array: the list to filter
  * @returns the `array` filtered by Boolean function
 */
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
