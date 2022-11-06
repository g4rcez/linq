import { filter } from "./filter";

export const unique = <T>(array: T[], key?: keyof T) => {
  if (key === undefined) {
    return [...new Set(array).values()];
  }
  const seen = new Set();
  if (Array.isArray(key)) {
    return [...new Set(key)];
  }
  return filter((el) => {
    const duplicate = key ? seen.has(el[key]) : seen.has(key);
    if (!!key) {
      if (!duplicate) {
        seen.add(el[key]);
      }
    }
    return !duplicate;
  }, array);
};
