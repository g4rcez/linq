import { ArrayCallbackAssertion } from "./typing";

export const filter = <G>(callback: ArrayCallbackAssertion<G>, array: G[]) => {
	const mappedArray = [];
	const len = array.length;
	for (let index = 0; index < len; index++) {
		const includes = callback(array[index] as G, index, array);
		if (includes) {
			mappedArray.push(array[index] as G);
		}
	}
	return mappedArray;
};
