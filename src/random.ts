export const random = <T>(array: T[]) => {
	const len = array.length;
	const i = Math.floor(Math.random() * len);
	return array[i];
};
