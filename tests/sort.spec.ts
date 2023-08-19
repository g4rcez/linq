import { expect, test } from "vitest";
import { multiSort, Order } from "../src";

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
