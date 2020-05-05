import {
	AggregateType,
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
	OrderKeys,
	RangeType,
	ReduceType,
	SomeType,
	SortType,
	SortParameters,
	SymbolMap,
	Symbols,
} from "./typing";
import { curry, deepClone, Equals, genCharArray, getKey, isNumberOrStr, sortBy, spreadData } from "./utils";

const symbolMap: SymbolMap<any, any> = {
	"!=": (value, compare) => value != compare,
	"!==": (value, compare) => value !== compare,
	"<": (value, compare) => value < compare,
	"<=": (value, compare) => value <= compare,
	"==": (value, compare) => value == compare,
	"===": (value, compare) => value === compare,
	">": (value, compare) => value > compare,
	">=": (value, compare) => value >= compare,
	eq: Equals,
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

	public constructor(array: Type[]) {
		this.array = [...array];
	}

	public static From<T>(array: T[]) {
		return new Linq<T>(array);
	}

	public static Aggregate = curry(
		<T>(
			firstValue: T,
			fn: (next: T, accumulator: T) => T,
			array: T[],
			transform: (val: T) => unknown = (v: unknown) => v,
		) => {
			const val = Linq.Reduce(fn, firstValue, array);
			return transform(val) as any;
		},
	) as AggregateType;

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
	public static Chunk: ChunkType = curry(<GENERICS>(size: number, array: GENERICS[]) =>
		Linq.Reduce(
			(arr, item, index): any => {
				if (index % size === 0) {
					return [...arr, [item]];
				}
				return [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
			},
			([] as any) as GENERICS[][],
			array,
		),
	) as any;

	public static Contains: (<GENERICS>(element: GENERICS | keyof GENERICS, array: GENERICS[]) => boolean) &
		(<GENERICS>(element: GENERICS | keyof GENERICS) => (array: GENERICS[]) => boolean) = curry(
		<GENERICS>(element: GENERICS | keyof GENERICS, array: GENERICS[]) => {
			if (typeof element === "object") {
				for (let index = 0; index < array.length; index++) {
					const current = array[index];
					if (Equals(element, current)) {
						return true;
					}
				}
				return false;
			}
			for (let index = 0; index < array.length; index++) {
				const current = array[index];
				if (Equals(element, current)) {
					return true;
				}
			}
			return false;
		},
	);
	public static Every = everyArray;
	public static Filter: FilterType = curry(
		<GENERICS>(callback: ArrayCallbackAssertion<GENERICS>, array: GENERICS[]) => {
			const mappedArray = [];
			for (let index = 0; index < array.length; index++) {
				const includes = callback(array[index] as GENERICS, index, array);
				if (includes) {
					mappedArray.push(spreadData(array[index]) as GENERICS);
				}
			}
			return mappedArray;
		},
	);
	public static Find: FindType = curry(<GENERICS>(callback: ArrayCallbackAssertion<GENERICS>, array: GENERICS[]) => {
		for (let index = 0; index < array.length; index++) {
			const includes = callback(array[index] as GENERICS, index, array);
			if (includes) {
				return spreadData(array[index]) as GENERICS;
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
	public static Max: (<GENERICS>(element: keyof GENERICS, array: GENERICS[]) => number) &
		(<GENERICS>(
			element: keyof GENERICS,
		) => (array: GENERICS[]) => number) = curry(<GENERICS>(element: keyof GENERICS, array: GENERICS[]) =>
		Linq.Reduce((oa, u) => Math.max(oa, u[element] as any), 0, array),
	) as any;
	public static Min: (<GENERICS>(element: keyof GENERICS, array: GENERICS[]) => number) &
		(<GENERICS>(
			element: keyof GENERICS,
		) => (array: GENERICS[]) => number) = curry(<GENERICS>(element: keyof GENERICS, array: GENERICS[]) =>
		Linq.Reduce((oa, u) => Math.min(oa, u[element] as any), Number.MAX_VALUE, array),
	) as any;
	public static Range: RangeType = (firstOrLength: number | string, secondOrSteps?: number | string, jumps = 1) => {
		if (secondOrSteps === undefined) {
			const [x, y, jp] = (firstOrLength as string).split("..");
			if (jp === undefined) {
				return genCharArray(x, y, 1) as any;
			}
			return genCharArray(x, jp, Number.parseInt(y, 10)) as any;
		}
		if (isNumberOrStr(firstOrLength) && isNumberOrStr(secondOrSteps)) {
			return genCharArray(`${firstOrLength}`, `${secondOrSteps}`, jumps);
		}
		return Array.from({ length: firstOrLength as number }, (_, i) => i * Math.abs(secondOrSteps as number));
	};
	public static Reduce: ReduceType = curry(
		<GENERICS, Initial>(
			callback: (acc: Initial, current: GENERICS, index: number, array: GENERICS[]) => unknown,
			initial: Initial,
			array: GENERICS[],
		) => {
			let accumulator = initial;
			for (let index = 0; index < array.length; index++) {
				const element = array[index];
				accumulator = callback(accumulator, element, index, array) as any;
			}
			return accumulator;
		},
	) as any;
	public static Repeat: (<GENERICS>(element: GENERICS, repeat: number) => GENERICS[]) &
		(<GENERICS>(element: GENERICS) => (repeat: number) => GENERICS[]) = curry(
		<GENERICS>(element: GENERICS, repeat: number) => {
			const array = [] as GENERICS[];
			for (let index = 0; index < repeat; index++) {
				array.push(element);
			}
			return array;
		},
	);
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
			return shallowCopy;
		}
		if (typeof key === "function") {
			shallowCopy.sort(key);
			return shallowCopy;
		}
		shallowCopy.sort(sortBy(key as any) as never);
		return shallowCopy;
	};
	public static Unique: (<T>(array: T[], key?: keyof T) => T[]) & (<T>(array: T[]) => T[]) = <T>(
		array: T[],
		key?: keyof T,
	) => {
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
	public Where: (
		props:
			| {
					key?: keyof Type;
					symbol?: Symbols;
					value?: unknown;
			  }
			| ArrayCallbackAssertion<Type>,
	) => this = (args) => {
		if (typeof args === "function") {
			this.array = this.array.filter(args);
			return this;
		}
		const { symbol, value, key } = args;
		if (!!key && !!symbol && value) {
			this.array = Linq.Filter(
				(x, i, array) => OperationFromSymbol(symbol!)(getKey(x, key), value, i, array),
				this.array,
			);
		} else {
			this.array = Linq.Filter((x, i, array) => OperationFromSymbol(symbol!)(x, value, i, array), this.array);
		}
		return this;
	};

	public Reverse() {
		this.array = this.array.reverse();
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

	public Concat(list: Type[]) {
		return this.Add(list);
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
				findIndex = array.findIndex((obj: unknown) => Equals(obj, el));
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
		if (predicate !== undefined) {
			for (let index = this.array.length; index !== 0; index--) {
				const includes = predicate(this.array[index] as Type, index, this.array);
				if (includes) {
					return spreadData(this.array[index]);
				}
			}
		}
		return;
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
		return Linq.Some((x) => Equals(x, object), this.array);
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

	public Aggregate(
		fn: (next: Type, accumulator: Type) => Type,
		firstValue?: Type,
		transform: (val: Type) => unknown = (v: any) => v as any,
	) {
		return Linq.Aggregate(firstValue ?? (spreadData(this.array[0]) as any), fn, this.array, transform);
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

	public All(predicate: ArrayCallbackAssertion<Type>) {
		return Linq.All(predicate, this.array);
	}
}
