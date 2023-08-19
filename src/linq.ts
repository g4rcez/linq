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
import { multiSort, sort, Sorter } from "./methods/sort";
import type {
  ArrayAsObj,
  ArrayCallback,
  ArrayCallbackAssertion,
  Maybe,
  OrderKeys,
  SortParameters,
  Symbols
} from "./methods/typing";
import { equals, getKey } from "./methods/utils";
import { where } from "./methods/where";
import { range } from "./methods/range";

export class Linq<Entity extends unknown> {
  public constructor(private array: Entity[] = []) {
  }

  public static Range(...args: Parameters<typeof range>) {
    return range(...args);
  }

  public Where(args: ArrayCallbackAssertion<Entity> | Maybe<keyof Entity>, symbol?: Symbols, value?: any) {
    this.array = where(this.array, args, symbol, value);
    return this;
  }

  public Reverse() {
    this.array = reverse(this.array);
    return this;
  }

  public Add(el: Entity | Entity[]) {
    this.array = Array.isArray(el) ? this.array.concat(el) : this.array.concat([el]);
    return this;
  }

  public Prepend(el: Entity | Entity[]) {
    this.array = Array.isArray(el) ? el.concat(this.array) : [el].concat(this.array);
    return this;
  }

  public Select(transform?: ArrayCallback<Entity>) {
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

  public Skip(jumps: number | ArrayCallbackAssertion<Entity>) {
    return skip(jumps, this.array);
  }

  public Distinct() {
    this.array = distinct(this.array);
    return this;
  }

  public First(predicate?: ArrayCallbackAssertion<Entity>) {
    return predicate === undefined ? this.array[0] : find(this.array, predicate) || null;
  }

  public Last(predicate?: ArrayCallbackAssertion<Entity>) {
    const len = this.array.length;
    if (predicate === undefined) {
      return this.array[len - 1];
    }
    for (let index = len; index !== 0; index--) {
      const includes = predicate(this.array[index] as Entity, index, this.array);
      if (includes) {
        return this.array[index];
      }
    }
    return undefined;
  }

  public Sum<K extends keyof Entity>(key?: K) {
    return key === undefined
      ? reduce((acc, el) => (acc as number) + (el as unknown as number), 0, this.array)
      : reduce((acc, el) => acc + getKey<number>(el, key), 0, this.array);
  }

  public Average<K extends keyof Entity>(key?: K) {
    return this.Sum(key) / this.array.length;
  }

  public GroupBy(key: keyof Entity) {
    return groupBy(this.array, key);
  }

  public Except(exceptions: Entity[]) {
    return filter(this.array, (x) => !contains(exceptions, x));
  }

  public Intersect(commons: Entity[]) {
    return filter<Entity>(this.array, (x) => contains(commons, x));
  }

  public OrderBy(key?: keyof Entity, order?: OrderKeys) {
    let array: Entity[];
    array = !!key ? sort(this.array, key) : [...this.array].sort();
    this.array = order === "desc" ? reverse(array) : array;
    return this;
  }

  public Includes(object: Entity) {
    return any(this.array, (x) => equals(x, object));
  }

  public In(array: Entity[]) {
    const len = array.length;
    for (let index = 0; index < len; index++) {
      const element = array[index];
      const includesElement = this.Includes(element);
      if (includesElement) return true;
    }
    return false;
  }

  public Reduce<Fn extends (next: Entity, accumulator: Entity) => Entity>(fn: Fn, firstValue: Entity) {
    return reduce(fn, firstValue ?? (this.array[0] as any), this.array);
  }

  public Empty() {
    return this.array.length === 0;
  }

  public ToMap<K>(key: keyof Entity): Map<K, Entity> {
    return new Map<K, Entity>(map<any>(this.array, (item) => [key, item]));
  }

  public Zip(array: Entity[], fn: (first: Entity, second?: Entity) => any) {
    return map(this.array, (item, index) => fn(item, array[index]));
  }

  public Count(predicate?: ArrayCallbackAssertion<Entity>) {
    return predicate === undefined ? this.array.length : filter(this.array, predicate).length;
  }

  public Get(n: number) {
    return this.array[n];
  }

  public Clone() {
    return new Linq<Entity>(deepClone(this.array));
  }

  public ToObject(key: keyof Entity): ArrayAsObj<Entity> {
    return dict(this.array, key);
  }

  public Sort(sorter?: SortParameters<Entity> | Sorter<Entity>[]) {
    return Array.isArray(sorter) ? multiSort<Entity>(this.array, sorter) : sort(this.array, sorter);
  }
}
