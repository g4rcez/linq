import { ObjectMap } from "./typing";

export const Equals = (a: any, b: any): boolean => {
	if (a === b) {
		return true;
	}
	if (a instanceof Date && b instanceof Date) {
		return a.getTime() === b.getTime();
	}
	if (!a || !b || (typeof a !== "object" && typeof b !== "object")) {
		return a === b;
	}
	if (a.prototype !== b.prototype) {
		return false;
	}
	const keys = Object.keys(a);
	if (keys.length !== Object.keys(b).length) {
		return false;
	}
	return keys.every((k) => Equals(a[k], b[k]));
};

export const curry = (fn: (...a: any) => any) => {
	const curried = function(...t: any[]) {
		return t.length >= fn.length ? fn.call(this as any, ...t) : curried.bind(this as any, ...t);
	};
	return curried;
};

export const spreadData = (item: unknown) => {
	if (Array.isArray(item)) {
		return [...item];
	}
	if (typeof item === "object" && item !== null) {
		return { ...item };
	}
	return item;
};

export const getKey = <T>(obj: any, key?: any): T => {
	if ((typeof obj === "object" || Array.isArray(obj)) && !!key) {
		return obj[key];
	}
	return obj;
};

export const sortBy = (key: string) => (a: ObjectMap, b: ObjectMap) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0);

export const genCharArray = (charA: string, charZ: string) => {
	const a = [];
	let i = charA.charCodeAt(0);
	const j = charZ.charCodeAt(0);
	for (; i <= j; ++i) {
		a.push(String.fromCharCode(i));
	}
	return a;
};
