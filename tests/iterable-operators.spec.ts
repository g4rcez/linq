import { describe, expect, it } from "vitest";
import Linq from "../src";

const test = it.concurrent;

describe("deferred and streaming operators", () => {
  test("re-enumerates a deferred query against the current source", () => {
    const source = [1, 2];
    let predicateCalls = 0;
    const query = new Linq(source)
      .Where((value) => {
        predicateCalls++;
        return value > 1;
      })
      .Select((value) => value * 2);

    expect(predicateCalls).toBe(0);
    source.push(3);
    expect(query.ToArray()).toEqual([4, 6]);
    expect(predicateCalls).toBe(3);
    expect(query.ToArray()).toEqual([4, 6]);
    expect(predicateCalls).toBe(6);
  });

  test("streams an infinite source through Select, Where, and Take", () => {
    function* numbers() {
      for (let value = 0; ; value++) yield value;
    }

    expect(
      new Linq(numbers())
        .Where((value) => value % 2 === 0)
        .Select((value) => value * 3)
        .Take(4)
        .ToArray(),
    ).toEqual([0, 6, 12, 18]);
  });

  test("supports indexed predicates and projections", () => {
    expect(
      new Linq(["a", "b", "c"])
        .Where((_value, index) => index > 0)
        .Select((value, index) => `${index}:${value}`)
        .ToArray(),
    ).toEqual(["0:b", "1:c"]);
  });

  test("TakeWhile and SkipWhile stop applying predicates after the boundary", () => {
    const values = new Linq([1, 2, 3, 1, 2]);
    expect(values.TakeWhile((value) => value < 3).ToArray()).toEqual([1, 2]);
    expect(values.SkipWhile((value) => value < 3).ToArray()).toEqual([3, 1, 2]);
  });
});

describe("sequence and set operators", () => {
  test("uses Set semantics for distinct and set operations", () => {
    const values = new Linq([1, 1, 2, 3, 3]);
    expect(values.Distinct().ToArray()).toEqual([1, 2, 3]);
    expect(values.Except([2, 4, 4]).ToArray()).toEqual([1, 3]);
    expect(values.Intersect([2, 2, 3]).ToArray()).toEqual([2, 3]);
    expect(values.Union([3, 4, 4]).ToArray()).toEqual([1, 2, 3, 4]);
  });

  test("supports key-based set operators and preserves first occurrences", () => {
    const first = [
      { id: 1, name: "a" },
      { id: 2, name: "b" },
      { id: 1, name: "c" },
    ];
    expect(new Linq(first).DistinctBy("id").ToArray()).toEqual([first[0], first[1]]);
    expect(new Linq(first).ExceptBy([2], "id").ToArray()).toEqual([first[0]]);
    expect(new Linq(first).IntersectBy([1], "id").ToArray()).toEqual([first[0]]);
    expect(
      new Linq(first)
        .UnionBy(
          [
            { id: 2, name: "d" },
            { id: 3, name: "e" },
          ],
          "id",
        )
        .ToArray(),
    ).toEqual([first[0], first[1], { id: 3, name: "e" }]);
  });

  test("uses object identity for reference elements by default", () => {
    const first = { value: 1 };
    const structurallyEqual = { value: 1 };
    expect(new Linq([first, first, structurallyEqual]).Distinct().ToArray()).toEqual([first, structurallyEqual]);
  });

  test("TakeLast and SkipLast retain only the required suffix buffer", () => {
    const values = new Linq([1, 2, 3, 4, 5]);
    expect(values.TakeLast(2).ToArray()).toEqual([4, 5]);
    expect(values.SkipLast(2).ToArray()).toEqual([1, 2, 3]);
    expect(values.TakeLast(0).ToArray()).toEqual([]);
    expect(values.SkipLast(0).ToArray()).toEqual([1, 2, 3, 4, 5]);
    expect(values.TakeLast(10).ToArray()).toEqual([1, 2, 3, 4, 5]);
  });

  test("chunks without rebuilding previous chunks", () => {
    expect(new Linq([1, 2, 3, 4, 5]).Chunk(2).ToArray()).toEqual([[1, 2], [3, 4], [5]]);
    expect(() => new Linq([1]).Chunk(0)).toThrow(RangeError);
  });

  test("Zip stops at the shorter sequence and SequenceEqual compares lazily", () => {
    expect(new Linq([1, 2, 3]).Zip(["a", "b"], (number, letter) => `${number}${letter}`).ToArray()).toEqual([
      "1a",
      "2b",
    ]);
    expect(new Linq([1, Number.NaN, 3]).SequenceEqual([1, Number.NaN, 3])).toBe(true);
    expect(new Linq([1, 2]).SequenceEqual([1, 2, 3])).toBe(false);
  });
});

describe("ordering, grouping, and joins", () => {
  test("orders stably and evaluates each key selector once per element", () => {
    const values = [
      { group: "a", score: 4, id: 1 },
      { group: "b", score: 2, id: 2 },
      { group: "a", score: 4, id: 3 },
      { group: "a", score: 8, id: 4 },
    ];
    let groupKeyCalls = 0;
    let scoreKeyCalls = 0;
    const ordered = new Linq(values)
      .OrderBy((item) => {
        groupKeyCalls++;
        return item.group;
      })
      .ThenByDescending((item) => {
        scoreKeyCalls++;
        return item.score;
      });

    expect(groupKeyCalls).toBe(0);
    expect(scoreKeyCalls).toBe(0);
    expect(ordered.Select((item) => item.id).ToArray()).toEqual([4, 1, 3, 2]);
    expect(groupKeyCalls).toBe(values.length);
    expect(scoreKeyCalls).toBe(values.length);
  });

  test("GroupBy is deferred and preserves key and element order", () => {
    let reads = 0;
    const source = {
      *[Symbol.iterator]() {
        for (const value of ["ant", "bear", "ape", "bird"]) {
          reads++;
          yield value;
        }
      },
    };
    const groups = new Linq(source).GroupBy(
      (word) => word.length,
      (word) => word.toUpperCase(),
    );

    expect(reads).toBe(0);
    const iterator = groups[Symbol.iterator]();
    const first = iterator.next();
    expect(reads).toBe(4);
    expect(first.done).toBe(false);
    expect(first.value?.Key).toBe(3);
    expect(first.value?.ToArray()).toEqual(["ANT", "APE"]);
    iterator.return?.();
  });

  test("Join and GroupJoin use a lookup and retain outer order", () => {
    const departments = [
      { id: 1, name: "Science" },
      { id: 2, name: "Arts" },
    ];
    const students = [
      { departmentId: 1, name: "Ada" },
      { departmentId: 1, name: "Alan" },
      { departmentId: 3, name: "Grace" },
    ];

    expect(
      new Linq(departments)
        .Join(students, "id", "departmentId", (department, student) => `${department.name}:${student.name}`)
        .ToArray(),
    ).toEqual(["Science:Ada", "Science:Alan"]);
    expect(
      new Linq(departments)
        .GroupJoin(students, "id", "departmentId", (department, group) => [department.name, Array.from(group)])
        .ToArray(),
    ).toEqual([
      ["Science", [students[0], students[1]]],
      ["Arts", []],
    ]);
  });

  test("does not enumerate a join's inner sequence for an empty outer source", () => {
    let innerReads = 0;
    const inner = {
      *[Symbol.iterator]() {
        innerReads++;
        yield { id: 1 };
      },
    };
    expect(new Linq<{ id: number }>([]).Join(inner, "id", "id", (outer) => outer).ToArray()).toEqual([]);
    expect(innerReads).toBe(0);
  });
});

describe("terminal operators and materialization", () => {
  test("short-circuits Any, All, First, and Single", () => {
    let visits = 0;
    expect(
      new Linq([1, 2, 3, 4]).Any((value) => {
        visits++;
        return value === 2;
      }),
    ).toBe(true);
    expect(visits).toBe(2);

    expect(new Linq([10, 20, 30]).Single((_value, index) => index === 0)).toBe(10);
    expect(new Linq([1, 2, 3]).First((value) => value > 1)).toBe(2);
    expect(new Linq([1, 2, 3]).All((value) => value > 0)).toBe(true);
  });

  test("provides C#-style empty and cardinality failures", () => {
    expect(new Linq<number>([]).FirstOrDefault()).toBeUndefined();
    expect(new Linq<number>([]).LastOrDefault()).toBeUndefined();
    expect(new Linq<number>([]).SingleOrDefault()).toBeUndefined();
    expect(new Linq<number>([]).DefaultIfEmpty(7).ToArray()).toEqual([7]);
    expect(() => new Linq<number>([]).First()).toThrow(RangeError);
    expect(() => new Linq([1, 2]).Single()).toThrow(RangeError);
  });

  test("supports indexed lookup and default values", () => {
    const values = new Linq(["zero", "one", "two"]);
    expect(values.ElementAt(1)).toBe("one");
    expect(values.ElementAtOrDefault(4)).toBeUndefined();
    expect(() => values.ElementAt(-1)).toThrow(RangeError);
    expect(new Linq([1, 2, 3]).Skip(1).Take(1).ToArray()).toEqual([2]);
  });

  test("selects a single-pass aggregate and converts to maps and lookups", () => {
    const people = new Linq([
      { id: 1, group: "a", name: "Ada" },
      { id: 2, group: "a", name: "Alan" },
      { id: 3, group: "b", name: "Grace" },
    ]);
    expect(people.Aggregate("", (names, person) => (names === "" ? person.name : `${names},${person.name}`))).toBe(
      "Ada,Alan,Grace",
    );
    expect(people.ToDictionary("id").get(2)?.name).toBe("Alan");
    expect(people.ToLookup("group").get("a")?.length).toBe(2);
    expect(people.ToHashSet().size).toBe(3);
    expect(() => new Linq([{ id: 1 }, { id: 1 }]).ToDictionary("id")).toThrow(RangeError);
  });

  test("supports element selectors for GroupBy and grouping conversions", () => {
    const groups = new Linq([1, 2, 3, 4])
      .GroupBy(
        (value) => value % 2,
        (value) => value * 10,
      )
      .ToArray();
    expect(groups.map((group) => [group.Key, group.ToArray()])).toEqual([
      [1, [10, 30]],
      [0, [20, 40]],
    ]);
  });

  test("validates numeric range and repeat bounds", () => {
    expect(Linq.Range(4, 3).ToArray()).toEqual([4, 5, 6]);
    expect(Linq.Repeat("x", 3).ToArray()).toEqual(["x", "x", "x"]);
    expect(Linq.Empty<number>().Count()).toBe(0);
    expect(() => Linq.Range(2_147_483_647, 2)).toThrow(RangeError);
    expect(() => Linq.Repeat("x", -1)).toThrow(RangeError);
  });
});
