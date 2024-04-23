import { describe, expect, it } from "vitest";
import Linq from "../src";

const test = it.concurrent;

const reduceSum = (acc: number, el: number) => acc + el;

describe("General operations", () => {
  test("Get sum", () => {
    const arr = [0, 1, 2, 2, 3, 4, 5, 6, 7];
    const arrays = new Linq(arr);
    const sum = arr.reduce(reduceSum, 0);
    expect(sum).toBe(arrays.Sum());
  });

  test("Sum only 2", () => {
    const arr = [0, 1, 2, 2, 3, 4, 5, 6, 7];
    const arrays = new Linq(arr);
    const filter = arr.filter((x) => x === 2).reduce(reduceSum, 0);
    expect(filter).toBe(arrays.Where(null, "===", 2).Sum());
  });

  test("Reverse Array", () => {
    const arrays = new Linq([
      { name: "bruce", surname: "lee" },
      { name: "bruce", surname: "wayne" },
      { name: "brucer", surname: "nothing" },
      { name: "chuck", surname: "norris" },
      { name: "foo", surname: "bar" },
      { name: "fu", surname: "bá" },
      { name: "peter", surname: "parker" }
    ]);
    expect(arrays.Reverse().Select()).toStrictEqual([
      { name: "peter", surname: "parker" },
      { name: "fu", surname: "bá" },
      { name: "foo", surname: "bar" },
      { name: "chuck", surname: "norris" },
      { name: "brucer", surname: "nothing" },
      { name: "bruce", surname: "wayne" },
      { name: "bruce", surname: "lee" }
    ]);
  });

  test("Range", () => {
    expect(Linq.Range("18..40").length).toEqual(23);
  });

  test("Where with like", () => {
    const arrays = new Linq([
      { name: "Foo", surname: "Bar" },
      { name: "Fu", surname: "Bá" },
      { name: "Chuck", surname: "Norris" },
      { name: "Bruce", surname: "Lee" },
      { name: "Bruce", surname: "Wayne" },
      { name: "Brucer", surname: "Nothing" },
      { name: "Peter", surname: "Parker" }
    ]);
    expect([
      { name: "Bruce", surname: "Lee" },
      { name: "Bruce", surname: "Wayne" },
      { name: "Brucer", surname: "Nothing" }
    ]).toEqual(arrays.Where("name", "like", "Bruce").Select());
  });

  test("All like", () => {
    const arrays = new Linq([
      { name: "Bruce", surname: "Lee" },
      { name: "Bruce", surname: "Wayne" },
      { name: "Brucer", surname: "Nothing" }
    ]).All("name", "includes", "Bruce");
    expect(arrays).toBe(true);
  });

  test("Some like", () => {
    const arrays = new Linq([
      { name: "Foo", surname: "Bar" },
      { name: "Fu", surname: "Bá" },
      { name: "Chuck", surname: "Norris" },
      { name: "Bruce", surname: "Lee" },
      { name: "Bruce", surname: "Wayne" },
      { name: "Brucer", surname: "Nothing" },
      { name: "Peter", surname: "Parker" }
    ]).Some("name", "includes", "Bruce");
    expect(arrays).toBe(true);
  });
});
