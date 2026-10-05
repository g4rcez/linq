import { describe, expect, it } from "vitest";
import Linq from "../src";

const test = it.concurrent;

describe("LINQ to Objects", () => {
  test("aggregates a sequence in one pass", () => {
    const numbers = new Linq([0, 1, 2, 2, 3, 4, 5, 6, 7]);
    expect(numbers.Sum()).toBe(30);
    expect(numbers.Where((number) => number === 2).Sum()).toBe(4);
  });

  test("reverses without mutating the source", () => {
    const source = [1, 2, 3, 4];
    expect(new Linq(source).Reverse().ToArray()).toEqual([4, 3, 2, 1]);
    expect(source).toEqual([1, 2, 3, 4]);
  });

  test("creates an Enumerable.Range-compatible sequence", () => {
    expect(Linq.Range(18, 23).ToArray()).toEqual([
      18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    ]);
  });

  test("filters and projects lazily with method syntax", () => {
    const people = new Linq([
      { name: "Foo", surname: "Bar" },
      { name: "Fu", surname: "Bá" },
      { name: "Chuck", surname: "Norris" },
      { name: "Bruce", surname: "Lee" },
      { name: "Bruce", surname: "Wayne" },
      { name: "Brucer", surname: "Nothing" },
      { name: "Peter", surname: "Parker" },
    ]);

    expect(
      people
        .Where((person) => person.name.startsWith("Bruce"))
        .Select((person) => person.name)
        .ToArray(),
    ).toEqual(["Bruce", "Bruce", "Brucer"]);
    expect(people.All((person) => person.name.includes("B"))).toBe(false);
    expect(people.Any((person) => person.name === "Peter")).toBe(true);
  });
});
