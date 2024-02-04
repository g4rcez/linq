import { test, expect, describe } from "vitest";
import { groupBy } from "../src";
import { groupWith } from "../src/methods/group-by";

describe("Should test groupBy/groupWith", () => {
  test("Should test group-by id", () => {
    const items = [
      { id: 1, name: "a" },
      { id: 1, name: "b" },
      { id: 1, name: "c" },
      { id: 2, name: "A" },
      { id: 2, name: "B" },
    ];
    const groups = groupBy(items, "id");
    expect(groups["1"].length).toBe(3);
    expect(groups["2"].length).toBe(2);
  });

  test("Should test group-with using upperCase", () => {
    const items = [
      { id: 1, name: "a" },
      { id: 1, name: "b" },
      { id: 1, name: "c" },
      { id: 2, name: "A" },
      { id: 2, name: "B" },
    ];
    const groups = groupWith(items, (x) => (x.name.toUpperCase() === x.name ? "upper" : "lower"));
    expect(groups.upper.length).toBe(2);
    expect(groups.lower.length).toBe(3);
  });
});
