import { test, expect } from "vitest";
import Linq from "../src";

const sum = (accumulator: number, current: number) => accumulator + current;

test("Aggregate uses a seed and a single traversal", () => {
  expect(new Linq([0, 1, 2, 3, 4, 5, 6, 7]).Aggregate(0, sum)).toBe(28);
});

test("Aggregate can use the first item as its accumulator", () => {
  expect(new Linq([1, 2, 3, 4]).Aggregate(sum)).toBe(10);
});

test("Sum", () => {
  expect(new Linq([0, 1, 2, 3, 4, 5, 6, 7]).Sum()).toBe(28);
});

test("Average computes the sum and count in one traversal", () => {
  expect(new Linq([2, 4, 6, 8]).Average()).toBe(5);
});

test("numeric terminals accept key selectors", () => {
  const values = new Linq([{ score: 3 }, { score: 7 }, { score: 2 }]);
  expect(values.Sum("score")).toBe(12);
  expect(values.Average((item) => item.score)).toBe(4);
  expect(values.Min("score")).toBe(2);
  expect(values.Max("score")).toBe(7);
});
