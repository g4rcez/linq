import { ObjectMap } from "./typing";

export const equals = (a: any, b: any): boolean => {
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
	return keys.every((k) => equals(a[k], b[k]));
};

export const curry = (fn: (...a: any) => any) => {
	const curried = function(...t: any[]) {
		return t.length >= fn.length ? fn.call(this as any, ...t) : curried.bind(this as any, ...t);
	};
	return curried;
};

const primitives = ["bigint", "boolean", "number", "string"];

const isPrimitive = (e: unknown) => primitives.includes(typeof e);

export const spreadData = (item: unknown) => {
	if (isPrimitive(item)) {
		return item;
	}
	return deepClone(item);
};

export const getKey = <T>(obj: any, key?: any): T => {
	if ((typeof obj === "object" || Array.isArray(obj)) && !!key) {
		return obj[key];
	}
	return obj;
};

export const sortBy = (key: string) => (a: ObjectMap, b: ObjectMap) => {
	if (a[key] === b[key]) {
		return 0;
	}
	return a[key] > b[key] ? 1 : -1;
};

const isNumber = (a: string) => /[0-9.]+/.test(a);

const individualChars = (charA: string, charZ: string, jumps = 1) => {
	const a = [];
	let i = charA.charCodeAt(0);
	const j = charZ.charCodeAt(0);
	for (; i <= j; i += jumps) {
		a.push(String.fromCharCode(i));
	}
	if (isNumber(charA) && isNumber(charZ)) {
		return a.map((x) => Number.parseInt(x));
	}
	return a;
};

const getInSequence = (a: string, b: string): [number, number] => {
	let x = Number.parseInt(a, 10);
	let y = Number.parseInt(b, 10);
	return x > y ? [y, x] : [x, y];
};

export const genCharArray = (charA: string, charZ: string, jumps = 1) => {
	let abs = Math.abs(jumps);
	if (charA.length > 1 || charZ.length > 1) {
		if (isNumber(charA) && isNumber(charZ)) {
			const a = [];
			const [first, second] = getInSequence(charA, charZ);
			for (let i = first; i <= second; i += abs) {
				a.push(i);
			}
			return a;
		}
	}
	return individualChars(charA, charZ, abs);
};

export const deepClone = (obj: any) => {
	if (obj === null) {
		return null;
	}
	let clone = Object.assign({}, obj);
	Object.keys(clone).forEach((key) => (clone[key] = typeof obj[key] === "object" ? deepClone(obj[key]) : obj[key]));
	return Array.isArray(obj) && obj.length
		? (clone.length = obj.length) && Array.from(clone)
		: Array.isArray(obj)
		? Array.from(obj)
		: clone;
};

export const isNumberOrString = (o: unknown) => ["string", "number"].includes(typeof o);
