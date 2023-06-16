export const groupBy = <T, K extends keyof T>(key: K, array: T[]) => {
  const map = new Map<T[K], T[]>();
  array.forEach((x) => {
    const k = x[key];
    const item = map.get(k) || [];
    item.push(x);
    map.set(k, item);
  });
  return Object.fromEntries(map.entries());
};
