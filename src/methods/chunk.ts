import { reduce } from "./reduce";

export const chunk = <T>(size: number, array: T[]) => {
  return reduce(
    (arr, item, index) => (index % size === 0 ? [...arr, [item]] : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]]),
    [] as T[][],
    array
  );
};
