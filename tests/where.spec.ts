import Linq from "../src";
import { it, describe, expect } from "vitest";

const test = it.concurrent;

type Item = { X: number | string };

const items: Item[] = [
  { X: 1 },
  { X: 1 },
  { X: "test" },
  { X: "test" },
  { X: "test" },
  { X: "test" },
  { X: 1 },
  { X: 1 },
  { X: 2 },
];

describe("Where", () => {
  test("filters with strict equality", () => {
    expect(new Linq(items).Where((item) => item.X === 2).Count()).toBe(1);
  });

  test("filters with strict inequality", () => {
    expect(new Linq(items).Where((item) => item.X !== 1).Count()).toBe(5);
  });

  test("filters numeric comparisons", () => {
    expect(new Linq(items).Where((item) => typeof item.X === "number" && item.X > 1).Count()).toBe(1);
  });

  test("filters strings by prefix and suffix", () => {
    expect(new Linq(items).Where((item) => typeof item.X === "string" && item.X.startsWith("te")).Count()).toBe(4);
    expect(new Linq(items).Where((item) => typeof item.X === "string" && item.X.endsWith("st")).Count()).toBe(4);
  });

  test("filters membership without changing source order", () => {
    expect(new Linq(items).Where((item) => typeof item.X === "number" && [1, 2].includes(item.X)).Count()).toBe(5);
    expect(new Linq(items).Where((item) => typeof item.X === "string" || (item.X !== 1 && item.X !== 2)).Count()).toBe(
      4,
    );
  });
});
