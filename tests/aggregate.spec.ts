import { test, expect } from "vitest";
import Linq from "../src";

const reduceSum = (acc: number, el: number) => acc + el;

test("Aggregate sum - instance", () => {
  const arr = [0, 1, 2, 3, 4, 5, 6, 7];
  const linq = new Linq(arr);
  const sum = linq.Reduce(reduceSum, 0);
  expect(sum).toEqual(28);
});

test("Sum", () => {
  const arr = [0, 1, 2, 3, 4, 5, 6, 7];
  const linq = new Linq(arr);
  expect(linq.Sum()).toEqual(28);
});

test("Average", () => {
  const arr = [2, 4, 6, 8];
  const linq = new Linq(arr);
  expect(linq.Average()).toEqual(5);
});
