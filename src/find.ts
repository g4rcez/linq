import { ArrayCallbackAssertion } from "./typing";
import { spreadData } from "./utils";

export const find = <G>(callback: ArrayCallbackAssertion<G>, array: G[]) => {
	const len = array.length;
	for (let index = 0; index < len; index++) {
		const includes = callback(array[index] as G, index, array);
		if (includes) {
			return spreadData(array[index]) as G;
		}
	}
	return undefined;
};
