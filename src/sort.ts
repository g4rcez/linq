type Key<T> = T extends string ? string : keyof T;

const selectTuple = <T, S>(a: T, b: T, key: keyof T | string) => {
	const valA = (a[key as keyof T] as unknown) as S;
	const valB = (b[key as keyof T] as unknown) as S;
	return [valA, valB];
};

const isNil = (key: unknown) => key === undefined || key === null;

export const StringSort = <T>(key?: Key<T> | null, reverse = false) => {
	if (reverse) {
		return (a: T, b: T) => {
			if (isNil(key)) {
				return ((b as any) as string).localeCompare((a as unknown) as string);
			}
			const [valA, valB] = selectTuple(a, b, key!);
			return valA.localeCompare(valB);
		};
	}
	return (a: T, b: T) => {
		if (isNil(key)) {
			return (a as any).localeCompare((b as unknown) as string);
		}
		const [valA, valB] = selectTuple(a, b, key!);
		return valA.localeCompare(valB) * -1;
	};
};

export const NumberSort = <T>(key?: Key<T>, reverse = false) => {
	if (reverse) {
		return (a: T, b: T) => {
			if (isNil(key)) {
				return ((b as any) as number) - (a as any);
			}
			const [valA, valB] = selectTuple(a, b, key!);
			return valB - valA;
		};
	}
	return (a: T, b: T) => {
		if (isNil(key)) {
			return (a as any) - ((b as unknown) as number);
		}
		const [valA, valB] = selectTuple(a, b, key!);
		return valA - valB;
	};
};

export const DateSort = <T>(key?: Key<T>, reverse = false) => {
	if (reverse) {
		return (a: T, b: T) => {
			if (isNil(key)) {
				return Date.parse(b as any) - Date.parse(a as any);
			}
			const [valA, valB] = selectTuple(a, b, key!);
			return Date.parse(valB) - Date.parse(valA);
		};
	}
	return (a: T, b: T) => {
		if (isNil(key)) {
			return Date.parse(a as any) - Date.parse(b as any);
		}
		const [valA, valB] = selectTuple(a, b, key!);
		return Date.parse(valA) - Date.parse(valB);
	};
};
