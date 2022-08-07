import { ArrayCallbackAssertion } from "./typing";

export const any = <T>(callback: ArrayCallbackAssertion<T>, array: T[]) => {
	const len = array.length;
	for (let index = 0; index < len; index++) {
		const includes = callback(array[index] as T, index, array);
		if (includes) {
			return true;
		}
	}
	return false;
};
