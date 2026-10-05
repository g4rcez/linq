import { describe, expect, it } from "vitest";
import Linq from "../src";

const test = it.concurrent;

describe("runtime type guards and empty sequences", () => {
  test("OfType filters while Cast rejects the first incompatible value", () => {
    const values = new Linq<unknown>(["first", 2, "last"]);
    const isString = (value: unknown): value is string => typeof value === "string";

    expect(values.OfType(isString).ToArray()).toEqual(["first", "last"]);
    expect(() => values.Cast(isString).ToArray()).toThrow(TypeError);
  });

  test("DefaultIfEmpty distinguishes an omitted default from an explicit value", () => {
    expect(new Linq<number>([]).DefaultIfEmpty().ToArray()).toEqual([undefined]);
    expect(new Linq<number>([]).DefaultIfEmpty(7).ToArray()).toEqual([7]);
    expect(new Linq([3]).DefaultIfEmpty(7).ToArray()).toEqual([3]);
  });
});

describe("iterator ownership", () => {
  test("closes a source iterator when an Aggregate reducer throws", () => {
    let closed = false;
    function* source() {
      try {
        yield 1;
        yield 2;
      } finally {
        closed = true;
      }
    }

    expect(() =>
      new Linq(source()).Aggregate(() => {
        throw new Error("stop");
      }),
    ).toThrow("stop");
    expect(closed).toBe(true);
  });
});
