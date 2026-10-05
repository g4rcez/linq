export const distinct = <T>(array: T[]) => {
  const uniqueValues: T[] = [];
  const seen = new Set<T>();
  for (const item of array) {
    if (seen.has(item)) continue;
    seen.add(item);
    uniqueValues.push(item);
  }
  return uniqueValues;
};
