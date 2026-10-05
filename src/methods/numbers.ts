export type Max = ((array: number[]) => number) | (<T>(array: T[], element: keyof T) => number);
type NumericKey<T> = { [K in keyof T]-?: T[K] extends number ? K : never }[keyof T];
type NumberSelector<T> = NumericKey<T> | ((item: T, index: number) => number) | undefined;

const numericValue = <T>(item: T, selector: NumberSelector<T>, index: number) => {
  if (selector === undefined) return item as unknown as number;
  if (typeof selector === "function") return selector(item, index);
  return item[selector] as unknown as number;
};

export function max(array: number[]): number;
export function max<T>(array: T[], selector: NumericKey<T> | ((item: T, index: number) => number)): number;
export function max<T>(array: T[], selector?: NumberSelector<T>): number {
  let found = false;
  let maximum = 0;
  let index = 0;
  for (const item of array) {
    const value = numericValue(item, selector, index++);
    if (!found || value > maximum) {
      maximum = value;
      found = true;
    }
  }
  if (!found) throw new RangeError("Sequence contains no elements");
  return maximum;
}

export function min(array: number[]): number;
export function min<T>(array: T[], selector: NumericKey<T> | ((item: T, index: number) => number)): number;
export function min<T>(array: T[], selector?: NumberSelector<T>): number {
  let found = false;
  let minimum = 0;
  let index = 0;
  for (const item of array) {
    const value = numericValue(item, selector, index++);
    if (!found || value < minimum) {
      minimum = value;
      found = true;
    }
  }
  if (!found) throw new RangeError("Sequence contains no elements");
  return minimum;
}

export function sum(array: number[]): number;
export function sum<T>(array: T[], selector: NumericKey<T> | ((item: T, index: number) => number)): number;
export function sum<T>(array: T[], selector?: NumberSelector<T>): number {
  let total = 0;
  let index = 0;
  for (const item of array) total += numericValue(item, selector, index++);
  return total;
}

export function diff(array: number[]): number;
export function diff<T>(array: T[], selector: NumericKey<T> | ((item: T, index: number) => number)): number;
export function diff<T>(array: T[], selector?: NumberSelector<T>): number {
  let difference = 0;
  let index = 0;
  for (const item of array) difference -= numericValue(item, selector, index++);
  return difference;
}
