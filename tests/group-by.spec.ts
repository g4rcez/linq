import { test, expect } from "vitest";
import { groupBy } from "../src";

test("Should test group-by id", () => {
  const items = [
    { id: 1, name: "a" },
    { id: 1, name: "b" },
    { id: 1, name: "c" },
    { id: 2, name: "A" },
    { id: 2, name: "B" }
  ];
  const groups = groupBy(items, "id");
  expect(groups["1"].length).toBe(3);
  expect(groups["2"].length).toBe(2);
});
