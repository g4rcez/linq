export type Selector<TSource, TResult> = (item: TSource, index: number) => TResult;
export type Predicate<T> = (item: T, index: number) => boolean;
export type EqualityComparer<T> = (left: T, right: T) => boolean;
export type Comparer<T> = (left: T, right: T) => number;
export type KeySelector<TSource, TKey> = Selector<TSource, TKey> | keyof TSource;
type NumericKey<T> = { [K in keyof T]-?: T[K] extends number ? K : never }[keyof T];
type NumericSelector<T> = Selector<T, number> | NumericKey<T>;

export interface IGrouping<TKey, TElement> extends Iterable<TElement> {
  readonly Key: TKey;
  readonly Count: number;
  ToArray(): TElement[];
}

export class Grouping<TKey, TElement> implements IGrouping<TKey, TElement> {
  public constructor(
    public readonly Key: TKey,
    private readonly elements: TElement[],
  ) {}

  public get Count() {
    return this.elements.length;
  }

  public [Symbol.iterator](): Iterator<TElement> {
    return this.elements[Symbol.iterator]();
  }

  public ToArray() {
    const copy: TElement[] = [];
    for (const element of this.elements) copy.push(element);
    return copy;
  }
}

interface Ordering<T> {
  readonly selector: Selector<T, unknown>;
  readonly comparer: Comparer<unknown>;
  readonly descending: boolean;
}

interface OrderedValue<T> {
  readonly value: T;
  readonly keys: unknown[];
  readonly index: number;
}

const defer = <T>(factory: () => Iterator<T>): Iterable<T> => ({ [Symbol.iterator]: factory });

const keySelector = <T, TKey>(selector: KeySelector<T, TKey>): Selector<T, TKey> => {
  if (typeof selector === "function") return selector as Selector<T, TKey>;
  return (item) => item[selector] as TKey;
};

const identity = <T>(item: T) => item;

const sameValueZero = <T>(left: T, right: T) =>
  left === right ||
  (typeof left === "number" && typeof right === "number" && Number.isNaN(left) && Number.isNaN(right));

const compareDefault = <T>(left: T, right: T): number => {
  if (sameValueZero(left, right)) return 0;
  if (left === null) return -1;
  if (right === null) return 1;
  if (left === undefined) return -1;
  if (right === undefined) return 1;
  if (left instanceof Date && right instanceof Date) {
    return left.getTime() - right.getTime();
  }
  if (typeof left === "number" && typeof right === "number") {
    if (Number.isNaN(left)) return 1;
    if (Number.isNaN(right)) return -1;
    return left < right ? -1 : 1;
  }
  if (typeof left === "string" && typeof right === "string") {
    return left.localeCompare(right);
  }
  if (typeof left === "bigint" && typeof right === "bigint") {
    return left < right ? -1 : 1;
  }
  if (typeof left === "boolean" && typeof right === "boolean") {
    return left ? 1 : -1;
  }
  throw new TypeError("Values must be comparable or an explicit comparer must be provided");
};

const numericSelector = <T>(selector?: NumericSelector<T>): Selector<T, number> => {
  if (selector === undefined) return (item) => item as unknown as number;
  if (typeof selector === "function") return selector;
  return (item) => item[selector] as number;
};

const checkedCount = (count: number, name: string) => {
  if (!Number.isSafeInteger(count)) throw new RangeError(`${name} must be a safe integer`);
  return Math.max(0, count);
};

const ordering = <T, TKey>(
  selector: KeySelector<T, TKey>,
  comparer: Comparer<TKey> | undefined,
  descending: boolean,
): Ordering<T> => ({
  selector: keySelector(selector),
  comparer: (comparer ?? compareDefault) as Comparer<unknown>,
  descending,
});

export class Linq<T> implements Iterable<T> {
  protected readonly constructorSource: Iterable<T>;

  public constructor(source: Iterable<T> = []) {
    this.constructorSource = source;
  }

  public static From<TSource>(source: Iterable<TSource>) {
    return new Linq(source);
  }

  public static Empty<TSource>() {
    return new Linq<TSource>([]);
  }

  public static Range(start: number, count: number) {
    if (
      !Number.isSafeInteger(start) ||
      start < -2_147_483_648 ||
      start > 2_147_483_647 ||
      !Number.isSafeInteger(count) ||
      count < 0 ||
      count > 2_147_483_647
    ) {
      throw new RangeError("Range requires a 32-bit integer start and a non-negative integer count");
    }
    if (count > 0 && start + count - 1 > 2_147_483_647) {
      throw new RangeError("Range exceeds the maximum 32-bit integer");
    }
    return new Linq(
      defer(function* () {
        for (let offset = 0; offset < count; offset++) yield start + offset;
      }),
    );
  }

  public static Repeat<TSource>(element: TSource, count: number) {
    if (!Number.isSafeInteger(count) || count < 0 || count > 2_147_483_647) {
      throw new RangeError("Repeat requires a non-negative 32-bit integer count");
    }
    return new Linq(
      defer(function* () {
        for (let index = 0; index < count; index++) yield element;
      }),
    );
  }

  public [Symbol.iterator](): Iterator<T> {
    return this.constructorSource[Symbol.iterator]();
  }

  public AsEnumerable() {
    return this;
  }

  public Where(predicate: Predicate<T>) {
    const source = this;
    return new Linq(
      defer(function* () {
        let index = 0;
        for (const item of source) {
          const currentIndex = index++;
          if (predicate(item, currentIndex)) yield item;
        }
      }),
    );
  }

  public Select<TResult>(selector: Selector<T, TResult>) {
    const source = this;
    return new Linq(
      defer(function* () {
        let index = 0;
        for (const item of source) yield selector(item, index++);
      }),
    );
  }

  public SelectMany<TCollection, TResult = TCollection>(
    collectionSelector: Selector<T, Iterable<TCollection>>,
    resultSelector?: (outer: T, inner: TCollection) => TResult,
  ) {
    const source = this;
    return new Linq<TResult>(
      defer(function* () {
        let outerIndex = 0;
        for (const outer of source) {
          const innerItems = collectionSelector(outer, outerIndex++);
          for (const inner of innerItems) {
            yield resultSelector === undefined ? (inner as unknown as TResult) : resultSelector(outer, inner);
          }
        }
      }),
    );
  }

  public OfType<TResult extends T>(typeGuard: (item: T) => item is TResult) {
    const source = this;
    return new Linq(
      defer(function* () {
        for (const item of source) if (typeGuard(item)) yield item;
      }),
    );
  }
  public Cast<TResult extends T>(typeGuard: (item: T) => item is TResult) {
    const source = this;
    return new Linq<TResult>(
      defer(function* () {
        for (const item of source) {
          if (!typeGuard(item)) throw new TypeError("Sequence contains an element of an incompatible type");
          yield item;
        }
      }),
    );
  }

  public Concat<TSecond>(second: Iterable<TSecond>) {
    const source = this;
    return new Linq<T | TSecond>(
      defer(function* () {
        for (const item of source) yield item;
        for (const item of second) yield item;
      }),
    );
  }

  public Append(item: T) {
    const source = this;
    return new Linq(
      defer(function* () {
        for (const value of source) yield value;
        yield item;
      }),
    );
  }

  public Prepend(item: T) {
    const source = this;
    return new Linq(
      defer(function* () {
        yield item;
        for (const value of source) yield value;
      }),
    );
  }

  public Take(count: number) {
    const limit = checkedCount(count, "Take");
    const source = this;
    return new Linq(
      defer(function* () {
        if (limit === 0) return;
        let taken = 0;
        for (const item of source) {
          yield item;
          taken++;
          if (taken === limit) return;
        }
      }),
    );
  }

  public Skip(count: number) {
    const toSkip = checkedCount(count, "Skip");
    const source = this;
    return new Linq(
      defer(function* () {
        let skipped = 0;
        for (const item of source) {
          if (skipped < toSkip) {
            skipped++;
            continue;
          }
          yield item;
        }
      }),
    );
  }

  public TakeWhile(predicate: Predicate<T>) {
    const source = this;
    return new Linq(
      defer(function* () {
        let index = 0;
        for (const item of source) {
          if (!predicate(item, index++)) return;
          yield item;
        }
      }),
    );
  }

  public SkipWhile(predicate: Predicate<T>) {
    const source = this;
    return new Linq(
      defer(function* () {
        let skipping = true;
        let index = 0;
        for (const item of source) {
          if (skipping && predicate(item, index++)) continue;
          skipping = false;
          yield item;
        }
      }),
    );
  }

  public TakeLast(count: number) {
    const limit = checkedCount(count, "TakeLast");
    const source = this;
    return new Linq(
      defer(function* () {
        if (limit === 0) return;
        const buffer: T[] = [];
        let nextIndex = 0;
        for (const item of source) {
          if (buffer.length < limit) buffer.push(item);
          else {
            buffer[nextIndex] = item;
            nextIndex = (nextIndex + 1) % limit;
          }
        }
        const start = buffer.length === limit ? nextIndex : 0;
        for (let index = 0; index < buffer.length; index++) yield buffer[(start + index) % buffer.length] as T;
      }),
    );
  }

  public SkipLast(count: number) {
    const limit = checkedCount(count, "SkipLast");
    const source = this;
    return new Linq(
      defer(function* () {
        if (limit === 0) {
          for (const item of source) yield item;
          return;
        }
        const buffer: T[] = [];
        let nextIndex = 0;
        for (const item of source) {
          if (buffer.length < limit) {
            buffer.push(item);
            continue;
          }
          yield buffer[nextIndex] as T;
          buffer[nextIndex] = item;
          nextIndex = (nextIndex + 1) % limit;
        }
      }),
    );
  }

  public Chunk(size: number) {
    if (!Number.isSafeInteger(size) || size <= 0) throw new RangeError("Chunk size must be a positive integer");
    const source = this;
    return new Linq(
      defer(function* () {
        let chunk: T[] = [];
        for (const item of source) {
          chunk.push(item);
          if (chunk.length === size) {
            yield chunk;
            chunk = [];
          }
        }
        if (chunk.length > 0) yield chunk;
      }),
    );
  }

  public DefaultIfEmpty(): Linq<T | undefined>;
  public DefaultIfEmpty(defaultValue: T): Linq<T>;
  public DefaultIfEmpty(defaultValue?: T): Linq<T> | Linq<T | undefined> {
    const source = this;
    return new Linq<T | undefined>(
      defer(function* () {
        let hasElement = false;
        for (const item of source) {
          hasElement = true;
          yield item;
        }
        if (!hasElement) yield defaultValue;
      }),
    );
  }

  public Distinct() {
    const source = this;
    return new Linq(
      defer(function* () {
        const seen = new Set<T>();
        for (const item of source) {
          if (seen.has(item)) continue;
          seen.add(item);
          yield item;
        }
      }),
    );
  }

  public DistinctBy<TKey>(selector: KeySelector<T, TKey>) {
    const source = this;
    const selectKey = keySelector(selector);
    return new Linq(
      defer(function* () {
        const seen = new Set<TKey>();
        let index = 0;
        for (const item of source) {
          const key = selectKey(item, index++);
          if (seen.has(key)) continue;
          seen.add(key);
          yield item;
        }
      }),
    );
  }

  public Except(second: Iterable<T>) {
    const source = this;
    return new Linq(
      defer(function* () {
        const excluded = new Set<T>();
        for (const item of second) excluded.add(item);
        const yielded = new Set<T>();
        for (const item of source) {
          if (excluded.has(item) || yielded.has(item)) continue;
          yielded.add(item);
          yield item;
        }
      }),
    );
  }

  public ExceptBy<TKey>(second: Iterable<TKey>, selector: KeySelector<T, TKey>) {
    const source = this;
    const selectKey = keySelector(selector);
    return new Linq(
      defer(function* () {
        const excluded = new Set<TKey>();
        for (const key of second) excluded.add(key);
        const yielded = new Set<TKey>();
        let index = 0;
        for (const item of source) {
          const key = selectKey(item, index++);
          if (excluded.has(key) || yielded.has(key)) continue;
          yielded.add(key);
          yield item;
        }
      }),
    );
  }

  public Intersect(second: Iterable<T>) {
    const source = this;
    return new Linq(
      defer(function* () {
        const remaining = new Set<T>();
        for (const item of second) remaining.add(item);
        for (const item of source) if (remaining.delete(item)) yield item;
      }),
    );
  }

  public IntersectBy<TKey>(secondKeys: Iterable<TKey>, selector: KeySelector<T, TKey>) {
    const source = this;
    const selectKey = keySelector(selector);
    return new Linq(
      defer(function* () {
        const remaining = new Set<TKey>();
        for (const key of secondKeys) remaining.add(key);
        let index = 0;
        for (const item of source) if (remaining.delete(selectKey(item, index++))) yield item;
      }),
    );
  }

  public Union(second: Iterable<T>) {
    const source = this;
    return new Linq(
      defer(function* () {
        const seen = new Set<T>();
        for (const item of source) {
          if (seen.has(item)) continue;
          seen.add(item);
          yield item;
        }
        for (const item of second) {
          if (seen.has(item)) continue;
          seen.add(item);
          yield item;
        }
      }),
    );
  }

  public UnionBy<TKey>(second: Iterable<T>, selector: KeySelector<T, TKey>) {
    const source = this;
    const selectKey = keySelector(selector);
    return new Linq(
      defer(function* () {
        const seen = new Set<TKey>();
        let index = 0;
        for (const item of source) {
          const key = selectKey(item, index++);
          if (seen.has(key)) continue;
          seen.add(key);
          yield item;
        }
        for (const item of second) {
          const key = selectKey(item, index++);
          if (seen.has(key)) continue;
          seen.add(key);
          yield item;
        }
      }),
    );
  }

  public Reverse() {
    const source = this;
    return new Linq(
      defer(function* () {
        const buffer: T[] = [];
        for (const item of source) buffer.push(item);
        for (let index = buffer.length - 1; index >= 0; index--) yield buffer[index] as T;
      }),
    );
  }

  public OrderBy<TKey>(selector: KeySelector<T, TKey>, comparer?: Comparer<TKey>) {
    return new OrderedLinq(this, [ordering(selector, comparer, false)]);
  }

  public OrderByDescending<TKey>(selector: KeySelector<T, TKey>, comparer?: Comparer<TKey>) {
    return new OrderedLinq(this, [ordering(selector, comparer, true)]);
  }

  public Order(comparer?: Comparer<T>) {
    return this.OrderBy(identity<T>, comparer);
  }

  public GroupBy<TKey, TElement = T>(selector: KeySelector<T, TKey>, elementSelector?: Selector<T, TElement>) {
    const source = this;
    const selectKey = keySelector(selector);
    return new Linq<Grouping<TKey, TElement>>(
      defer(function* () {
        const groups = new Map<TKey, TElement[]>();
        let index = 0;
        for (const item of source) {
          const key = selectKey(item, index);
          const element = elementSelector === undefined ? (item as unknown as TElement) : elementSelector(item, index);
          let elements = groups.get(key);
          if (elements === undefined) {
            elements = [];
            groups.set(key, elements);
          }
          elements.push(element);
          index++;
        }
        for (const [key, elements] of groups) yield new Grouping(key, elements);
      }),
    );
  }

  public Join<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: KeySelector<T, TKey>,
    innerKeySelector: KeySelector<TInner, TKey>,
    resultSelector: (outer: T, inner: TInner) => TResult,
  ) {
    const source = this;
    const selectOuterKey = keySelector(outerKeySelector);
    const selectInnerKey = keySelector(innerKeySelector);
    return new Linq<TResult>(
      defer(function* () {
        let lookup: Map<TKey, TInner[]> | undefined;
        let outerIndex = 0;
        for (const outer of source) {
          if (lookup === undefined) {
            lookup = new Map<TKey, TInner[]>();
            let innerIndex = 0;
            for (const innerItem of inner) {
              const key = selectInnerKey(innerItem, innerIndex++);
              if (key === null) continue;
              let matches = lookup.get(key);
              if (matches === undefined) {
                matches = [];
                lookup.set(key, matches);
              }
              matches.push(innerItem);
            }
          }
          const key = selectOuterKey(outer, outerIndex++);
          if (key === null) continue;
          const matches = lookup.get(key);
          if (matches !== undefined) {
            for (const innerItem of matches) yield resultSelector(outer, innerItem);
          }
        }
      }),
    );
  }

  public GroupJoin<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: KeySelector<T, TKey>,
    innerKeySelector: KeySelector<TInner, TKey>,
    resultSelector: (outer: T, group: Iterable<TInner>) => TResult,
  ) {
    const source = this;
    const selectOuterKey = keySelector(outerKeySelector);
    const selectInnerKey = keySelector(innerKeySelector);
    return new Linq<TResult>(
      defer(function* () {
        let lookup: Map<TKey, TInner[]> | undefined;
        let outerIndex = 0;
        for (const outer of source) {
          if (lookup === undefined) {
            lookup = new Map<TKey, TInner[]>();
            let innerIndex = 0;
            for (const innerItem of inner) {
              const key = selectInnerKey(innerItem, innerIndex++);
              if (key === null) continue;
              let matches = lookup.get(key);
              if (matches === undefined) {
                matches = [];
                lookup.set(key, matches);
              }
              matches.push(innerItem);
            }
          }
          const key = selectOuterKey(outer, outerIndex++);
          yield resultSelector(outer, key === null ? [] : lookup.get(key) ?? []);
        }
      }),
    );
  }

  public Zip<TSecond>(second: Iterable<TSecond>): Linq<[T, TSecond]>;
  public Zip<TSecond, TResult>(
    second: Iterable<TSecond>,
    resultSelector: (first: T, second: TSecond, index: number) => TResult,
  ): Linq<TResult>;
  public Zip<TSecond, TResult>(
    second: Iterable<TSecond>,
    resultSelector?: (first: T, second: TSecond, index: number) => TResult,
  ): Linq<[T, TSecond] | TResult> {
    const source = this;
    return new Linq(
      defer(function* () {
        const firstIterator = source[Symbol.iterator]();
        const secondIterator = second[Symbol.iterator]();
        let index = 0;
        try {
          while (true) {
            const first = firstIterator.next();
            if (first.done) return;
            const next = secondIterator.next();
            if (next.done) return;
            yield resultSelector === undefined
              ? ([first.value, next.value] as [T, TSecond])
              : resultSelector(first.value, next.value, index);
            index++;
          }
        } finally {
          firstIterator.return?.();
          secondIterator.return?.();
        }
      }),
    );
  }

  public SequenceEqual(second: Iterable<T>, comparer: EqualityComparer<T> = sameValueZero) {
    const firstIterator = this[Symbol.iterator]();
    const secondIterator = second[Symbol.iterator]();
    let firstDone = false;
    let secondDone = false;
    try {
      while (true) {
        const first = firstIterator.next();
        firstDone = first.done === true;
        const next = secondIterator.next();
        secondDone = next.done === true;
        if (firstDone || secondDone) return firstDone && secondDone;
        if (!comparer(first.value, next.value)) return false;
      }
    } finally {
      if (!firstDone) firstIterator.return?.();
      if (!secondDone) secondIterator.return?.();
    }
  }

  public Any(predicate?: Predicate<T>) {
    let index = 0;
    for (const item of this) {
      if (predicate === undefined || predicate(item, index)) return true;
      index++;
    }
    return false;
  }

  public All(predicate: Predicate<T>) {
    let index = 0;
    for (const item of this) {
      if (!predicate(item, index++)) return false;
    }
    return true;
  }

  public Contains(value: T) {
    for (const item of this) if (sameValueZero(item, value)) return true;
    return false;
  }

  public Count(predicate?: Predicate<T>) {
    if (predicate === undefined) {
      if (Array.isArray(this.constructorSource)) return this.constructorSource.length;
      if (this.constructorSource instanceof Map || this.constructorSource instanceof Set)
        return this.constructorSource.size;
    }
    let count = 0;
    let index = 0;
    for (const item of this) {
      if (predicate === undefined || predicate(item, index)) count++;
      index++;
    }
    return count;
  }

  public LongCount(predicate?: Predicate<T>) {
    return this.Count(predicate);
  }

  public First(predicate?: Predicate<T>) {
    let index = 0;
    for (const item of this) {
      if (predicate === undefined || predicate(item, index)) return item;
      index++;
    }
    throw new RangeError(
      predicate === undefined ? "Sequence contains no elements" : "Sequence contains no matching element",
    );
  }

  public FirstOrDefault(predicate?: Predicate<T>) {
    let index = 0;
    for (const item of this) {
      if (predicate === undefined || predicate(item, index)) return item;
      index++;
    }
    return undefined;
  }

  public Last(predicate?: Predicate<T>) {
    if (predicate === undefined && Array.isArray(this.constructorSource)) {
      const values = this.constructorSource as T[];
      if (values.length === 0) throw new RangeError("Sequence contains no elements");
      return values[values.length - 1] as T;
    }
    let found = false;
    let last: T | undefined;
    let index = 0;
    for (const item of this) {
      if (predicate === undefined || predicate(item, index)) {
        found = true;
        last = item;
      }
      index++;
    }
    if (!found) {
      throw new RangeError(
        predicate === undefined ? "Sequence contains no elements" : "Sequence contains no matching element",
      );
    }
    return last as T;
  }

  public LastOrDefault(predicate?: Predicate<T>) {
    let found = false;
    let last: T | undefined;
    let index = 0;
    for (const item of this) {
      if (predicate === undefined || predicate(item, index)) {
        found = true;
        last = item;
      }
      index++;
    }
    return found ? last : undefined;
  }

  public Single(predicate?: Predicate<T>) {
    let found = false;
    let result: T | undefined;
    let index = 0;
    for (const item of this) {
      const currentIndex = index++;
      if (predicate !== undefined && !predicate(item, currentIndex)) continue;
      if (found) throw new RangeError("Sequence contains more than one matching element");
      found = true;
      result = item;
    }
    if (!found) {
      throw new RangeError(
        predicate === undefined ? "Sequence contains no elements" : "Sequence contains no matching element",
      );
    }
    return result as T;
  }

  public SingleOrDefault(predicate?: Predicate<T>) {
    let found = false;
    let result: T | undefined;
    let index = 0;
    for (const item of this) {
      const currentIndex = index++;
      if (predicate !== undefined && !predicate(item, currentIndex)) continue;
      if (found) throw new RangeError("Sequence contains more than one matching element");
      found = true;
      result = item;
    }
    return found ? result : undefined;
  }

  public ElementAt(index: number) {
    if (!Number.isSafeInteger(index) || index < 0) throw new RangeError("Index must be a non-negative safe integer");
    if (Array.isArray(this.constructorSource)) {
      const values = this.constructorSource as T[];
      if (index < values.length) return values[index] as T;
      throw new RangeError("Index is outside the sequence");
    }
    let currentIndex = 0;
    for (const item of this) {
      if (currentIndex++ === index) return item;
    }
    throw new RangeError("Index is outside the sequence");
  }

  public ElementAtOrDefault(index: number) {
    if (!Number.isSafeInteger(index) || index < 0) return undefined;
    if (Array.isArray(this.constructorSource)) return (this.constructorSource as T[])[index];
    let currentIndex = 0;
    for (const item of this) {
      if (currentIndex++ === index) return item;
    }
    return undefined;
  }

  public Aggregate(reducer: (accumulator: T, current: T, index: number) => T): T;
  public Aggregate<TAccumulator>(
    seed: TAccumulator,
    reducer: (accumulator: TAccumulator, current: T, index: number) => TAccumulator,
  ): TAccumulator;
  public Aggregate<TAccumulator, TResult>(
    seed: TAccumulator,
    reducer: (accumulator: TAccumulator, current: T, index: number) => TAccumulator,
    resultSelector: (accumulator: TAccumulator) => TResult,
  ): TResult;
  public Aggregate<TAccumulator, TResult>(
    seedOrReducer: TAccumulator | ((accumulator: T, current: T, index: number) => T),
    reducer?: (accumulator: TAccumulator, current: T, index: number) => TAccumulator,
    resultSelector?: (accumulator: TAccumulator) => TResult,
  ): T | TAccumulator | TResult {
    if (typeof seedOrReducer === "function" && reducer === undefined) {
      const iterator = this[Symbol.iterator]();
      try {
        const first = iterator.next();
        if (first.done) throw new RangeError("Sequence contains no elements");
        let accumulator = first.value as T;
        let index = 1;
        for (let next = iterator.next(); !next.done; next = iterator.next()) {
          accumulator = (seedOrReducer as (accumulator: T, current: T, index: number) => T)(
            accumulator,
            next.value,
            index++,
          );
        }
        return accumulator;
      } finally {
        iterator.return?.();
      }
    }
    if (reducer === undefined) throw new TypeError("Aggregate requires a reducer");
    let accumulator = seedOrReducer as TAccumulator;
    let index = 0;
    for (const item of this) accumulator = reducer(accumulator, item, index++);
    return resultSelector === undefined ? accumulator : resultSelector(accumulator);
  }

  public Sum(selector?: NumericSelector<T>) {
    const selectNumber = numericSelector(selector);
    let sum = 0;
    let index = 0;
    for (const item of this) sum += selectNumber(item, index++);
    return sum;
  }

  public Average(selector?: NumericSelector<T>) {
    const selectNumber = numericSelector(selector);
    let sum = 0;
    let count = 0;
    let index = 0;
    for (const item of this) {
      sum += selectNumber(item, index++);
      count++;
    }
    if (count === 0) throw new RangeError("Sequence contains no elements");
    return sum / count;
  }

  public Min(selector?: NumericSelector<T>) {
    const selectNumber = numericSelector(selector);
    let found = false;
    let minimum = 0;
    let index = 0;
    for (const item of this) {
      const value = selectNumber(item, index++);
      if (!found || value < minimum) {
        minimum = value;
        found = true;
      }
    }
    if (!found) throw new RangeError("Sequence contains no elements");
    return minimum;
  }

  public Max(selector?: NumericSelector<T>) {
    const selectNumber = numericSelector(selector);
    let found = false;
    let maximum = 0;
    let index = 0;
    for (const item of this) {
      const value = selectNumber(item, index++);
      if (!found || value > maximum) {
        maximum = value;
        found = true;
      }
    }
    if (!found) throw new RangeError("Sequence contains no elements");
    return maximum;
  }

  public MinBy<TKey>(selector: KeySelector<T, TKey>, comparer?: Comparer<TKey>) {
    return this.extremeBy(selector, comparer ?? compareDefault, false);
  }

  public MaxBy<TKey>(selector: KeySelector<T, TKey>, comparer?: Comparer<TKey>) {
    return this.extremeBy(selector, comparer ?? compareDefault, true);
  }

  private extremeBy<TKey>(selector: KeySelector<T, TKey>, comparer: Comparer<TKey>, maximum: boolean) {
    const selectKey = keySelector(selector);
    let found = false;
    let result: T | undefined;
    let bestKey: TKey | undefined;
    let index = 0;
    for (const item of this) {
      const currentKey = selectKey(item, index++);
      if (!found || (maximum ? comparer(currentKey, bestKey as TKey) > 0 : comparer(currentKey, bestKey as TKey) < 0)) {
        found = true;
        result = item;
        bestKey = currentKey;
      }
    }
    return result;
  }

  public ToArray() {
    const result: T[] = [];
    for (const item of this) result.push(item);
    return result;
  }

  public ToList() {
    return this.ToArray();
  }

  public ToHashSet() {
    const result = new Set<T>();
    for (const item of this) result.add(item);
    return result;
  }

  public ToDictionary<TKey, TValue = T>(selector: KeySelector<T, TKey>, valueSelector?: Selector<T, TValue>) {
    const selectKey = keySelector(selector);
    const result = new Map<TKey, TValue>();
    let index = 0;
    for (const item of this) {
      const key = selectKey(item, index);
      if (result.has(key)) throw new RangeError("An element with the same key already exists");
      const value = valueSelector === undefined ? (item as unknown as TValue) : valueSelector(item, index);
      result.set(key, value);
      index++;
    }
    return result;
  }

  public ToMap<TKey, TValue = T>(selector: KeySelector<T, TKey>, valueSelector?: Selector<T, TValue>) {
    const selectKey = keySelector(selector);
    const result = new Map<TKey, TValue>();
    let index = 0;
    for (const item of this) {
      const key = selectKey(item, index);
      const value = valueSelector === undefined ? (item as unknown as TValue) : valueSelector(item, index);
      result.set(key, value);
      index++;
    }
    return result;
  }

  public ToLookup<TKey, TElement = T>(selector: KeySelector<T, TKey>, elementSelector?: Selector<T, TElement>) {
    const selectKey = keySelector(selector);
    const lookup = new Map<TKey, TElement[]>();
    let index = 0;
    for (const item of this) {
      const key = selectKey(item, index);
      const element = elementSelector === undefined ? (item as unknown as TElement) : elementSelector(item, index);
      let group = lookup.get(key);
      if (group === undefined) {
        group = [];
        lookup.set(key, group);
      }
      group.push(element);
      index++;
    }
    return lookup;
  }
}

export class OrderedLinq<T> extends Linq<T> {
  public constructor(
    source: Iterable<T>,
    private readonly orderings: readonly Ordering<T>[],
  ) {
    super(source);
  }

  public override [Symbol.iterator](): Iterator<T> {
    const source = this.constructorSource;
    const orderings = this.orderings;
    return (function* () {
      const values: OrderedValue<T>[] = [];
      let index = 0;
      for (const value of source) {
        const keys: unknown[] = [];
        for (const clause of orderings) keys.push(clause.selector(value, index));
        values.push({ value, keys, index });
        index++;
      }
      values.sort((left, right) => {
        for (let orderIndex = 0; orderIndex < orderings.length; orderIndex++) {
          const clause = orderings[orderIndex] as Ordering<T>;
          const comparison = clause.comparer(left.keys[orderIndex], right.keys[orderIndex]);
          if (comparison !== 0) return clause.descending ? -comparison : comparison;
        }
        return left.index - right.index;
      });
      for (const value of values) yield value.value;
    })();
  }

  public ThenBy<TKey>(selector: KeySelector<T, TKey>, comparer?: Comparer<TKey>) {
    return new OrderedLinq(this.constructorSource, [...this.orderings, ordering(selector, comparer, false)]);
  }

  public ThenByDescending<TKey>(selector: KeySelector<T, TKey>, comparer?: Comparer<TKey>) {
    return new OrderedLinq(this.constructorSource, [...this.orderings, ordering(selector, comparer, true)]);
  }
}

export default Linq;
