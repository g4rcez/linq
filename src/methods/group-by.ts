/*
 * @param array: the list to create groups
 * @param key: the key to group elements of `array`
 * @returns object with `key` and values as items of `array`
 */
export const groupBy = <T, K extends keyof T>(array: T[], key: K) => {
  const map = new Map<T[K], T[]>();
  array.forEach((x) => {
    const k = x[key];
    const item = map.get(k) || [];
    item.push(x);
    map.set(k, item);
  });
  return Object.fromEntries(map.entries());
};
