import { reduce } from "./reduce";
import { ArrayAsObj } from "./typing";

export const dict = <T>(array: T[], key: keyof T): ArrayAsObj<T> =>
  reduce((acc, el) => ({ ...acc, [(el as any)[key]]: el }), {} as ArrayAsObj<T>, array);
