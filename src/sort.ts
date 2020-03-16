export const StringSort = <T>(key?: T extends string ? string : keyof T, reverse = false) => (a: T, b: T) => {
	if (typeof a === "string") {
		return a.localeCompare((b as unknown) as string);
	}
	const valA = (a[key as keyof T] as unknown) as string;
	const valB = (b[key as keyof T] as unknown) as string;
	return reverse ? valA.localeCompare(valB) * -1 : valA.localeCompare(valB);
};

export const NumberSort = <T>(key?: T extends string ? string : keyof T, reverse = false) => (a: T, b: T) => {
	if (typeof a === "number") {
		return a - ((b as unknown) as number);
	}
	const valA = (a[key as keyof T] as unknown) as number;
	const valB = (b[key as keyof T] as unknown) as number;
	return reverse ? valB - valA : valA - valB;
};
export const DateSort = <T>(key?: T extends string ? string : keyof T, reverse = false) => (a: T, b: T) => {
	if (typeof a === "string") {
		return Date.parse(a) - Date.parse(b as any);
	}
	const valA = Date.parse(a[key as keyof T] as any);
	const valB = Date.parse(b[key as keyof T] as any);
	return reverse ? valB - valA : valA - valB;
};
