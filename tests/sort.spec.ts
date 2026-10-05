import { expect, test } from "vitest";
import { Linq, multiSort, Order } from "../src";

test("Should test multiple sorter", () => {
  const shouldBeFirst = { id: 1, name: "a" };

  const items = [
    { id: 1, name: "c" },
    { id: 1, name: "b" },
    { id: 1, name: "c" },
    { id: 2, name: "a" },
    { id: 2, name: "b" },
    shouldBeFirst,
  ];
  const groups = multiSort(items, [
    { key: "id", type: Order.Asc },
    { key: "name", type: Order.Asc },
  ]);
  expect(groups[0]).toBe(shouldBeFirst);
});

test.each([
  [Number.NaN, 1],
  [1, Number.NaN],
])("orders NaN after finite values regardless of input order", (first, second) => {
  const source = new Linq([first, second]);
  const ordered = source.Order().ToArray();

  expect(ordered[0]).toBe(1);
  expect(ordered[1]).toBeNaN();
  expect(source.MinBy((value) => value)).toBe(1);
  expect(source.MaxBy((value) => value)).toBeNaN();
});

test.each([
  [null, undefined],
  [undefined, null],
])("orders null before undefined regardless of input order", (first, second) => {
  const source = new Linq<number | null | undefined>([first, second, 1]);
  expect(source.Order().ToArray()).toStrictEqual([null, undefined, 1]);

  const nullish = new Linq<number | null | undefined>([first, second]);
  expect(nullish.MinBy((value) => value)).toBeNull();
  expect(nullish.MaxBy((value) => value)).toBeUndefined();
});
