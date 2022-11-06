import { reduce } from "./reduce";
import { Grouped } from "./typing";

export const groupBy = <T>(key: keyof T, array: T[]) =>
  reduce(
    (g, el) => {
      const name: keyof T = el[key] as never;
      g[name] = g[name] || [];
      g[name].push(el as any);
      return g;
    },
    {} as Grouped<T>,
    array
  );
