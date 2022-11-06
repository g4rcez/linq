export const toMap = <T>(key: keyof T, array: T[]): Map<keyof T, T> => {
  const map = new Map<keyof T, T>();
  const len = array.length;
  for (let index = 0; index < len; index++) {
    const element = array[index];
    const elementKey = element[key];
    map.set(elementKey as never, element);
  }
  return map;
};
