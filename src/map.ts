import { ArrayCallback } from "./typing";

export const map = <T>(callback: ArrayCallback<T>, array: T[]) => {
	const mappedArray = [];
	let index = 0;
	const len = array.length;
	for (index; index < len; index++) {
		const transform = callback(array[index] as T, index, array);
		mappedArray.push(transform as T);
	}
	return mappedArray;
};
