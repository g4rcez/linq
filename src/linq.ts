import {
	ArrayAsObj,
	ArrayCallback,
	ArrayCallbackAssertion,
	ChunkType,
	EveryType,
	FilterType,
	FindType,
	GroupByType,
	Grouped,
	MapType,
	MathNumber,
	Maybe,
	OrderKeys,
	RangeType,
	ReduceType,
	Repeat,
	SomeType,
	SortParameters,
	SortType,
	SymbolMap,
	Symbols,
	Unique,
} from "./typing";
import { curry, deepClone, equals, genCharArray, getKey, isNumberOrString, sortBy, spreadData } from "./utils";

const symbolMap: SymbolMap<any, any> = {
	"!=": (value, compare) => value != compare,
	"!==": (value, compare) => value !== compare,
	"<": (value, compare) => value < compare,
	"<=": (value, compare) => value <= compare,
	"==": (value, compare) => value == compare,
	"===": (value, compare) => value === compare,
	">": (value, compare) => value > compare,
	">=": (value, compare) => value >= compare,
	like: (value: string | number, compare: string | number) => new RegExp(`${compare}`, "g").test(`${value}`),
	eq: equals,
	is: Object.is,
};

const OperationFromSymbol = (symbol: Symbols) => symbolMap[symbol];

const everyArray: EveryType = curry(<GENERICS>(callback: ArrayCallbackAssertion<GENERICS>, array: GENERICS[]) => {
	for (let index = 0; index < array.length; index++) {
		const includes = callback(array[index] as GENERICS, index, array);
		if (!includes) {
			return false;
		}
	}
	return true;
});

export class Linq<Type> {
	private array: Type[];

	public constructor(array: Type[] = []) {
		this.array = [...array];
	}

	public static From = <T>(array: T[]) => new Linq<T>(array);

	public static Clone = <T>(array: T[]) => new Linq(deepClone(array));

	public static First = <T>(array: T[]) => array[0];

	public static Last = <T>(array: T[]) => array[array.length - 1];

	public static All = everyArray;

	public static ArrayToMap: (<T>(key: keyof T, array: T[]) => Map<keyof T, T>) &
		(<T>(key: keyof T) => (array: T[]) => Map<keyof T, T>) = curry(
		<T>(key: keyof T, array: T[]): Map<keyof T, T> => {
			const map = new Map<keyof T, T>();
			const len = array.length;
			for (let index = 0; index < len; index++) {
				const element = array[index];
				const elementKey = element[key];
				map.set(elementKey as never, element);
			}
			return map;
		},
	);

	public static ArrayToObject: (<T>(key: keyof T, array: T[]) => ArrayAsObj<T>) &
		(<T>(key: keyof T, array: T[]) => ArrayAsObj<T>) = curry(<T>(key: keyof T) => (array: T[]): ArrayAsObj<T> =>
		array.reduce((acc, el) => ({ ...acc, [(el as any)[key]]: el }), {} as ArrayAsObj<T>),
	);

	public static Chunk: ChunkType = curry(<T>(size: number, array: T[]) =>
		Linq.Reduce(
			(arr, item, index): any => {
				if (index % size === 0) {
					return [...arr, [item]];
				}
				return [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
			},
			([] as any) as T[][],
			array,
		),
	) as any;

	public static Contains: (<T>(element: T | keyof T, array: T[]) => boolean) &
		(<T>(element: T | keyof T) => (array: T[]) => boolean) = curry(<T>(element: T | keyof T, array: T[]) => {
		if (typeof element === "object") {
			for (let index = 0; index < array.length; index++) {
				const current = array[index];
				if (equals(element, current)) {
					return true;
				}
			}
			return false;
		}
		for (let index = 0; index < array.length; index++) {
			const current = array[index];
			if (equals(element, current)) {
				return true;
			}
		}
		return false;
	});

	public static Every = everyArray;

	public static Filter: FilterType = curry(
		<G>(callback: ArrayCallbackAssertion<G>, array: G[]) => {
			const mappedArray = [];
			for (let index = 0; index < array.length; index++) {
				const includes = callback(array[index] as G, index, array);
				if (includes) {
					mappedArray.push(spreadData(array[index]) as G);
				}
			}
			return mappedArray;
		},
	);

	public static Find: FindType = curry(<G>(callback: ArrayCallbackAssertion<G>, array: G[]) => {
		for (let index = 0; index < array.length; index++) {
			const includes = callback(array[index] as G, index, array);
			if (includes) {
				return spreadData(array[index]) as G;
			}
		}
		return;
	});

	public static GroupBy: GroupByType = curry(<GENERICS>(key: keyof GENERICS, array: GENERICS[]) =>
		Linq.Reduce(
			(g, el) => {
				const name: keyof GENERICS = el[key] as never;
				const chunk = g[name] || [];
				g[name] = chunk;
				g[name].push(el as any);
				return g;
			},
			{} as Grouped<GENERICS>,
			array,
		),
	);

	public static Map: MapType = curry(<T>(callback: ArrayCallback<T>, array: T[]) => {
		const mappedArray = [];
		let index = 0;
		const len = array.length;
		for (index; index < len; index++) {
			const transform = callback(array[index] as T, index, array);
			mappedArray.push(spreadData(transform) as T);
		}
		return mappedArray;
	});

	public static MapToArray = <Key, Value>(map: Map<Key, Value>): Value[] => [...map.values()];

	public static Max: MathNumber = <G>(element: keyof G | number[], array?: G[]) => {
		if (Array.isArray(element)) {
			return Linq.Reduce((max, x) => Math.max(max, x as any), 0, element);
		}
		return Linq.Reduce((max, x) => Math.max(max, x[element] as any), 0, array!);
	};

	public static Min: MathNumber = <G>(element: keyof G | number[], array?: G[]) => {
		if (Array.isArray(element)) {
			return Linq.Reduce((min, x) => Math.min(min, x as any), Number.MAX_VALUE, element);
		}
		return Linq.Reduce((min, x) => Math.min(min, x[element] as any), Number.MAX_VALUE, array!);
	};

	public static Random<T>(array: T[]) {
		const len = array.length;
		const i = Math.floor(Math.random() * array.length);
		return array[i];
	}

	public static Range: RangeType = (firstOrLength: number | string, secondOrSteps?: number | string, jumps = 1) => {
		if (secondOrSteps === undefined) {
			const [x, y, jp] = (firstOrLength as string).split("..");
			if (jp === undefined) {
				return genCharArray(x, y, 1) as any;
			}
			return genCharArray(x, jp, Number.parseInt(y, 10)) as any;
		}
		if (isNumberOrString(firstOrLength) && isNumberOrString(secondOrSteps)) {
			return genCharArray(`${firstOrLength}`, `${secondOrSteps}`, jumps);
		}
		return Array.from({ length: firstOrLength as number }, (_, i) => i * Math.abs(secondOrSteps as number));
	};

	public static Reduce: ReduceType = curry(
		<T, I>(callback: (acc: I, current: T, index: number, array: T[]) => unknown, initial: I, array: T[]) => {
			let accumulator = initial;
			for (let index = 0; index < array.length; index++) {
				const element = array[index];
				accumulator = callback(accumulator, element, index, array) as any;
			}
			return accumulator;
		},
	);

	public static Repeat: Repeat = curry(<T>(element: T, repeat: number) => {
		const array = [] as T[];
		for (let index = 0; index < repeat; index++) {
			array.push(element);
		}
		return array;
	});

	public static Some: SomeType = curry(<T>(callback: ArrayCallbackAssertion<T>, array: T[]) => {
		for (let index = 0; index < array.length; index++) {
			const includes = callback(array[index] as T, index, array);
			if (includes) {
				return true;
			}
		}
		return false;
	});

	public static Sort: SortType = <GENERICS>(array: GENERICS[], key?: SortParameters<GENERICS>) => {
		const shallowCopy = [...array];
		if (key === undefined) {
			shallowCopy.sort();
		} else if (typeof key === "function") {
			shallowCopy.sort(key);
		} else {
			shallowCopy.sort(sortBy(key as any) as never);
		}
		return shallowCopy;
	};

	public static Unique: Unique = <T>(array: T[], key?: keyof T) => {
		if (key === undefined) {
			return [...new Set(array)];
		}
		const seen = new Set();
		if (Array.isArray(key)) {
			return [...new Set(key)];
		}
		return Linq.Filter((el) => {
			const duplicate = key ? seen.has(el[key]) : seen.has(key);
			if (!!key) {
				if (!duplicate) {
					seen.add(el[key]);
				}
			}
			return !duplicate;
		}, array);
	};

	public static Where = <T>(
		array: T[],
		args: ArrayCallbackAssertion<T> | Maybe<keyof T>,
		symbol: Symbols,
		value: unknown,
	) => {
		if (typeof args === "function") {
			return array.filter(args);
		}
		if (!!args && !!symbol && value) {
			return Linq.Filter((x, i, array) => OperationFromSymbol(symbol!)(getKey(x, args), value, i, array), array);
		}
		return Linq.Filter((x, i, array) => OperationFromSymbol(symbol!)(x, value, i, array), array);
	};

	public Where = (args: ArrayCallbackAssertion<Type> | Maybe<keyof Type>, symbol: Symbols, value: unknown) => {
		if (typeof args === "function") {
			this.array = this.array.filter(args);
			return this;
		}
		if (!!args && !!symbol && value) {
			this.array = Linq.Filter(
				(x, i, array) => OperationFromSymbol(symbol!)(getKey(x, args), value, i, array),
				this.array,
			);
		} else {
			this.array = Linq.Filter((x, i, array) => OperationFromSymbol(symbol!)(x, value, i, array), this.array);
		}
		return this;
	};

	public Reverse() {
		let left = null;
		let right = null;
		let length = this.array.length;
		for (left = 0; left < length / 2; left += 1) {
			right = length - 1 - left;
			let temporary = this.array[left];
			this.array[left] = this.array[right];
			this.array[right] = temporary;
		}
		return this;
	}

	public Add(el: Type | Type[]) {
		if (Array.isArray(el)) {
			this.array.push(...el);
		} else {
			this.array.push(el);
		}
		return this;
	}

	public Prepend(el: Type | Type[]) {
		if (Array.isArray(el)) {
			this.array = el.concat(this.array);
		} else {
			this.array = [el].concat(this.array);
		}
		return this;
	}

	public Select(transform?: ArrayCallback<Type>) {
		if (transform !== undefined) {
			return this.array.map(transform);
		}
		return this.array;
	}

	public Take(init: number, end?: number) {
		if (end !== undefined) {
			this.array = [...this.array].slice(init, Math.max(0, end));
		} else {
			this.array = [...this.array].slice(init);
		}
		return this;
	}

	public Head() {
		return spreadData(this.array[0]);
	}

	public Tail() {
		return this.Skip(1);
	}

	public Skip(jumps: number | ArrayCallbackAssertion<Type>) {
		if (typeof jumps === "number") {
			return this.array.slice(jumps);
		}
		let len = this.array.length;
		for (let index = 0; index < len; index++) {
			const element = this.array[index];
			const assertion = jumps(element, index, this.array);
			if (assertion) {
				return this.array.slice(index);
			}
		}
		return this.array.slice(0);
	}

	public Distinct() {
		this.array = Linq.Filter((el: Type, index: number, array: Type[]) => {
			let findIndex;
			if (typeof el === "object") {
				findIndex = array.findIndex((obj: unknown) => equals(obj, el));
			} else {
				findIndex = array.indexOf(el);
			}
			return index === findIndex;
		}, this.array);
		return this;
	}

	public ToArray() {
		return [...this.array];
	}

	public First(predicate?: ArrayCallbackAssertion<Type>) {
		if (predicate !== undefined) {
			const data = Linq.Find(predicate, this.array) || null;
			return spreadData(data);
		}
		return spreadData(this.array[0]);
	}

	public Last(predicate?: ArrayCallbackAssertion<Type>) {
		const len = this.array.length;
		if (predicate !== undefined) {
			for (let index = len; index !== 0; index--) {
				const includes = predicate(this.array[index] as Type, index, this.array);
				if (includes) {
					return spreadData(this.array[index]);
				}
			}
		}
		return this.array[len - 1];
	}

	public Sum(key?: keyof Type) {
		if (key === undefined) {
			return Linq.Reduce((acc, el) => (acc as number) + ((el as unknown) as number), 0, this.array);
		}
		return Linq.Reduce((acc, el) => acc + getKey<number>(el, key), 0, this.array);
	}

	public Average(key?: keyof Type) {
		return this.Sum(key) / this.array.length;
	}

	public GroupBy(key: keyof Type) {
		return Linq.GroupBy(key, this.array);
	}

	public Except(exceptions: Type[]) {
		return Linq.Filter((x) => !Linq.Contains(x, exceptions), this.array);
	}

	public Intersect(commons: Type[]) {
		return Linq.Filter((x) => Linq.Contains(x, commons), this.array);
	}

	public OrderBy(key?: keyof Type, sort?: OrderKeys) {
		let array = this.array;
		if (!!key) {
			array = Linq.Sort(this.array, key);
		} else {
			array = this.array.sort();
		}
		this.array = sort === "desc" ? [...array].reverse() : array;
		return this;
	}

	public Includes(object: Type) {
		return Linq.Some((x) => equals(x, object), this.array);
	}

	public In(array: Type[]) {
		const len = array.length;
		for (let index = 0; index < len; index++) {
			const element = array[index];
			const includesElement = this.Includes(element);
			if (includesElement) {
				return true;
			}
		}
		return false;
	}

	public Reduce(fn: (next: Type, accumulator: Type) => Type, firstValue: Type) {
		return Linq.Reduce(firstValue ?? (spreadData(this.array[0]) as any), fn, this.array);
	}

	public Empty() {
		return this.array.length === 0;
	}

	public ToMap<KEY>(key: keyof Type): Map<KEY, Type> {
		return new Map<KEY, Type>(Linq.Map<any>((item) => [key, item], this.array));
	}

	public Zip<T>(array: T[], fn: (first: Type, second?: T) => any) {
		return Linq.Map((item, index) => fn(item, array[index]), this.array);
	}

	public Count(predicate?: ArrayCallbackAssertion<Type>) {
		if (predicate === undefined) {
			return this.array.length;
		}
		return Linq.Filter(predicate, this.array).length;
	}

	public Get(n: number) {
		return spreadData(this.array[n]);
	}

	public Clone() {
		return new Linq(deepClone(this.array));
	}

	public ToObject(key: keyof Type): ArrayAsObj<Type> {
		return Linq.ArrayToObject(key, this.array);
	}
}
