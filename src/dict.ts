import { reduce } from "./reduce";
import { ArrayAsObj } from "./typing";

export const dict = <T>(key: keyof T, array: T[]): ArrayAsObj<T> =>
	reduce((acc, el) => ({ ...acc, [(el as any)[key]]: el }), {} as ArrayAsObj<T>, array);
