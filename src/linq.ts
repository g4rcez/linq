import { any } from "./methods/any";
import { deepClone } from "./methods/clone";
import { contains } from "./methods/contains";
import { dict } from "./methods/dict";
import { distinct } from "./methods/distinct";
import { filter } from "./methods/filter";
import { find } from "./methods/find";
import { groupBy } from "./methods/group-by";
import { map } from "./methods/map";
import { reduce } from "./methods/reduce";
import { reverse } from "./methods/reverse";
import { skip } from "./methods/skip";
import { sort } from "./methods/sort";
import { ArrayAsObj, ArrayCallback, ArrayCallbackAssertion, Maybe, OrderKeys, Symbols } from "./methods/typing";
import { equals, getKey } from "./methods/utils";
import { where } from "./methods/where";

export class Linq<L> {
  private array: L[];

  public constructor(array: L[] = []) {
    this.array = deepClone<L[]>(array);
  }

  public Where(args: ArrayCallbackAssertion<L> | Maybe<keyof L>, symbol?: Symbols, value?: any) {
    this.array = where(this.array, args, symbol, value);
    return this;
  }

  public Reverse() {
    this.array = reverse(this.array);
    return this;
  }

  public Add(el: L | L[]) {
    if (Array.isArray(el)) {
      this.array = this.array.concat(el);
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
    return transform !== undefined ? this.array.map(transform) : this.array;
  }

  public Take(init: number, end?: number) {
    if (end !== undefined) {
      this.array = this.array.slice(init, Math.max(0, end));
    } else {
      this.array = this.array.slice(init);
    }
    return this;
  }

  public Head() {
    return this.array[0];
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
    return this.array;
  }

  public First(predicate?: ArrayCallbackAssertion<L>) {
    return predicate === undefined ? this.array[0] : find(predicate, this.array) || null;
  }

  public Last(predicate?: ArrayCallbackAssertion<L>) {
    const len = this.array.length;
    if (predicate !== undefined) {
      for (let index = len; index !== 0; index--) {
        const includes = predicate(this.array[index] as L, index, this.array);
        if (includes) {
          return this.array[index];
        }
      }
    }
    return this.array[this.array.length - 1];
  }

  public Sum(key?: keyof L) {
    if (key === undefined) {
      return reduce((acc, el) => (acc as number) + (el as unknown as number), 0, this.array);
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
    let array: L[];
    if (!!key) {
      array = sort(this.array, key);
    } else {
      array = [...this.array].sort();
    }
    this.array = order === "desc" ? reverse(array) : array;
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
    return reduce(fn, firstValue ?? (this.array[0] as any), this.array);
  }

  public Empty() {
    return this.array.length === 0;
  }

  public ToMap<K>(key: keyof L): Map<K, L> {
    return new Map<K, L>(map<any>((item) => [key, item], this.array));
  }

  public Zip(array: L[], fn: (first: L, second?: L) => any) {
    return map((item, index) => fn(item, array[index]), this.array);
  }

  public Count(predicate?: ArrayCallbackAssertion<L>) {
    if (predicate === undefined) {
      return this.array.length;
    }
    return filter(predicate, this.array).length;
  }

  public Get(n: number) {
    return this.array[n];
  }

  public Clone() {
    return new Linq<L>(deepClone(this.array));
  }

  public ToObject(key: keyof L): ArrayAsObj<L> {
    return dict(key, this.array);
  }
}
