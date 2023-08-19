import { reduce } from "./reduce";

const MathMinMax = <G>(fn: typeof Math.min | typeof Math.min, key: keyof G, array?: G[]) =>
  Array.isArray(key) ? reduce((acc, el) => fn(acc, el), 0, key) : reduce((acc, el) => fn(acc, el[key] as any), 0, array!);

export type Max = ((array: number[]) => number) | (<T>(array: T[], element: keyof T) => number);

export const max: Max = <T>(array: T[], key: keyof T) =>
  MathMinMax(Math.max, key, array);

export const min: Max = <G>(array: G[], key: keyof G) =>
  MathMinMax(Math.min, key, array);

export const sum: Max = <T>(array: T[], key: keyof T) =>
  MathMinMax((a, b) => a + b, key, array);

export const diff: Max = <T>(array: T[], key: keyof T) =>
  MathMinMax((a, b) => a - b, key, array);
