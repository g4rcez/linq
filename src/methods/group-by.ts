/*
 * @param array: the list to create groups
 * @param key: the key to group elements of `array`
 * @returns object with `key` and values as items of `array`
 */
export const groupWith = <T, Func extends (t: T) => any>(array: T[], func: Func): Record<ReturnType<Func>, T[]> => {
  const map = new Map<ReturnType<Func>, T[]>();
  array.forEach((x) => {
    const k = func(x);
    const item = map.get(k) || [];
    item.push(x);
    map.set(k, item);
  });
  return Object.fromEntries(map.entries());
};

/*
 * @param array: the list to create groups
 * @param key: the key to group elements of `array`
 * @returns object with `key` and values as items of `array`
 */
export const groupBy = <T, K extends keyof T>(array: T[], key: K) => groupWith(array, (item) => item[key]);
