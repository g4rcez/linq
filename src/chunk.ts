import { reduce } from "./reduce";

export const chunk = <T>(size: number, array: T[]) =>
	reduce(
		(arr, item, index): any => {
			if (index % size === 0) {
				return [...arr, [item]];
			}
			return [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
		},
		[] as T[][],
		array,
	);
