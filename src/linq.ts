import { all } from "./all";
import { any } from "./any";
import { deepClone } from "./clone";
import { contains } from "./contains";
import { dict } from "./dict";
import { distinct } from "./distinct";
import { filter } from "./filter";
import { find } from "./find";
import { groupBy } from "./group-by";
import { map } from "./map";
import { reduce } from "./reduce";
import { reverse } from "./reverse";
import { skip } from "./skip";
import { sort } from "./sort";
import { ArrayAsObj, ArrayCallback, ArrayCallbackAssertion, Maybe, OrderKeys, Symbols } from "./typing";
import { equals, getKey, spreadData } from "./utils";
import { where } from "./where";

export class Linq<L> {
	private array: L[];

	public constructor(array: L[] = []) {
		this.array = deepClone<L[]>(array);
	}

	public static All = all;

	public Where = (args: ArrayCallbackAssertion<L> | Maybe<keyof L>, symbol?: Symbols, value?: any) => {
		this.array = where(this.array, args, symbol, value);
		return this;
	};

	public Reverse() {
		this.array = reverse(this.array);
		return this;
	}

	public Add(el: L | L[]) {
		if (Array.isArray(el)) {
			this.array.push(...el);
		} else {
			this.array.push(el);
		}
		return this;
	}

	public Prepend(el: L | L[]) {
		if (Array.isArray(el)) {
			this.array = el.concat(this.array);
		} else {
			this.array = [el].concat(this.array);
		}
		return this;
	}

	public Select(transform?: ArrayCallback<L>) {
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

	public Skip(jumps: number | ArrayCallbackAssertion<L>) {
		return skip(jumps, this.array);
	}

	public Distinct() {
		this.array = distinct(this.array);
		return this;
	}

	public ToArray() {
		return [...this.array];
	}

	public First(predicate?: ArrayCallbackAssertion<L>) {
		if (predicate === undefined) {
			return spreadData(this.array[0]);
		}
		const data = find(predicate, this.array) || null;
		return spreadData(data);
	}

	public Last(predicate?: ArrayCallbackAssertion<L>) {
		const len = this.array.length;
		if (predicate !== undefined) {
			for (let index = len; index !== 0; index--) {
				const includes = predicate(this.array[index] as L, index, this.array);
				if (includes) {
					return spreadData(this.array[index]);
				}
			}
		}
		const last = [...this.array].pop();
		return spreadData(last);
	}

	public Sum(key?: keyof L) {
		if (key === undefined) {
			return reduce((acc, el) => (acc as number) + ((el as unknown) as number), 0, this.array);
		}
		return reduce((acc, el) => acc + getKey<number>(el, key), 0, this.array);
	}

	public Average(key?: keyof L) {
		return this.Sum(key) / this.array.length;
	}

	public GroupBy(key: keyof L) {
		return groupBy(key, this.array);
	}

	public Except(exceptions: L[]) {
		return filter((x) => !contains(x, exceptions), this.array);
	}

	public Intersect(commons: L[]) {
		return filter((x) => contains(x, commons), this.array);
	}

	public OrderBy(key?: keyof L, order?: OrderKeys) {
		let array = this.array;
		if (!!key) {
			array = sort(this.array, key);
		} else {
			array = this.array.sort();
		}
		this.array = order === "desc" ? [...array].reverse() : array;
		return this;
	}

	public Includes(object: L) {
		return any((x) => equals(x, object), this.array);
	}

	public In(array: L[]) {
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

	public Reduce(fn: (next: L, accumulator: L) => L, firstValue: L) {
		return reduce(fn, firstValue ?? (spreadData(this.array[0]) as any), this.array);
	}

	public Empty = () => this.array.length === 0;

	public ToMap = <K>(key: keyof L): Map<K, L> => new Map<K, L>(map<any>((item) => [key, item], this.array));

	public Zip = (array: L[], fn: (first: L, second?: L) => any) =>
		map((item, index) => fn(item, array[index]), this.array);

	public Count(predicate?: ArrayCallbackAssertion<L>) {
		if (predicate === undefined) {
			return this.array.length;
		}
		return filter(predicate, this.array).length;
	}

	public Get = (n: number) => spreadData(this.array[n]);

	public Clone = () => new Linq<L>(deepClone(this.array));

	public ToObject = (key: keyof L): ArrayAsObj<L> => dict(key, this.array);
}
