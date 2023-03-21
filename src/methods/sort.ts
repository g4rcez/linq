import { SortParameters } from "./typing";
import { sortBy } from "./utils";

type Key<T> = keyof T | string;

const selectTuple = <T extends any>(key: Key<T>, a: any, b: any) => {
  const valA = a[key as keyof T] as any;
  const valB = b[key as keyof T] as any;
  return [valA, valB];
};

const isNil = (key: unknown) => key === undefined || key === null;

export const sortString = <T extends {}>(key?: Key<T> | null, reverse = false) => {
  if (reverse) {
    return (a: any, b: any) => {
      if (isNil(key)) {
        return (b as any as string).localeCompare(a as unknown as string);
      }
      const [valA, valB] = selectTuple(key!, a, b);
      return valA.localeCompare(valB);
    };
  }
  return (a: any, b: any) => {
    if (isNil(key)) {
      return (a as any).localeCompare(b as unknown as string);
    }
    const [valA, valB] = selectTuple(a, b, key!);
    return valA.localeCompare(valB) * -1;
  };
};

export const sortNumber = <T extends any>(key?: Key<T>, reverse = false) => {
  if (reverse) {
    return (a: any, b: any) => {
      if (isNil(key)) {
        return (b as any as number) - (a as any);
      }
      const [valA, valB] = selectTuple(key!, a, b);
      return valB - valA;
    };
  }
  return (a: any, b: any) => {
    if (isNil(key)) {
      return (a as any) - (b as unknown as number);
    }
    const [valA, valB] = selectTuple(a, b, key!);
    return valA - valB;
  };
};

export const sortDate = <T extends {}>(key?: Key<T>, reverse = false) => {
  if (reverse) {
    return (a: any, b: any) => {
      if (isNil(key)) {
        return Date.parse(b as any) - Date.parse(a as any);
      }
      const [valA, valB] = selectTuple(a, b, key!);
      return Date.parse(valB.toISOString()) - Date.parse(valA.toISOString());
    };
  }
  return (a: any, b: any) => {
    if (isNil(key)) {
      return Date.parse(a as any) - Date.parse(b as any);
    }
    const [valA, valB] = selectTuple(a, b, key!);
    return Date.parse(valA.toISOString()) - Date.parse(valB.toISOString());
  };
};

export const sort = <S>(array: S[], sorter?: SortParameters<S>) => {
  const shallowCopy = [...array];
  if (sorter === undefined) return shallowCopy.sort();
  if (typeof sorter === "function") return shallowCopy.sort(sorter);
  return shallowCopy.sort(sortBy(sorter as any) as never);
};
