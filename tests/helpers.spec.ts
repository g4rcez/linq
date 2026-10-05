import { describe, expect, it } from "vitest";
import { chunk, dict, distinct, max, min, range, sum } from "../src";

const test = it.concurrent;

describe("optimized array helpers", () => {
  test("chunks in linear passes and rejects invalid sizes", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunk([], 3)).toEqual([]);
    expect(() => chunk([1], 0)).toThrow(RangeError);
  });

  test("distinct uses reference identity and preserves first-occurrence order", () => {
    const first = { value: 1 };
    const structurallyEqual = { value: 1 };
    expect(distinct([first, first, structurallyEqual])).toEqual([first, structurallyEqual]);
    expect(distinct([NaN, NaN, 0, -0])).toEqual([NaN, 0]);
  });

  test("constructs a dictionary without intermediate mapped pairs", () => {
    const rows = [
      { id: 1, value: "first" },
      { id: 2, value: "second" },
      { id: 1, value: "last" },
    ];
    expect(dict(rows, "id")).toEqual({ 1: rows[2], 2: rows[1] });
  });

  test("numeric helpers correctly handle negative values and property keys", () => {
    expect(max([-10, -2, -7])).toBe(-2);
    expect(min([-10, -2, -7])).toBe(-10);
    expect(sum([{ score: 2 }, { score: 5 }], "score")).toBe(7);
    expect(sum([])).toBe(0);
    expect(() => max([])).toThrow(RangeError);
  });

  test("legacy range helper still enumerates numeric character ranges", () => {
    expect(range("1..3")).toEqual([1, 2, 3]);
  });
});
