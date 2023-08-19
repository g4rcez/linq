import Linq from "../src";
import { it, describe, expect } from "vitest";

const test = it.concurrent;

describe("Where test", () => {
  test("Where === N", () => {
    const arr = [{ X: 1 }, { X: 1 }, { X: 1 }, { X: 1 }, { X: 1 }, { X: 1 }, { X: 1 }, { X: 1 }, { X: 2 }];
    const linq = new Linq(arr);
    const odds = linq.Where("X", "===", 2).Select();
    expect(odds.length).toEqual(1);
  });

  test("Where !== N", () => {
    const arr = [{ X: 1 }, { X: 1 }, { X: 1 }, { X: 1 }, { X: 1 }, { X: 1 }, { X: 1 }, { X: 1 }, { X: 2 }];
    const linq = new Linq(arr);
    const odds = linq.Where("X", "!==", 1).Select();
    expect(odds.length).toEqual(1);
  });

  test("Greater than 3", () => {
    const arr = [
      { X: 4 },
      { X: 4 },
      { X: 4 },
      { X: 4 },
      { X: 4 },
      { X: 4 },
      { X: 4 },
      { X: 4 },
      { X: 2 },
      { X: 2 },
      { X: 2 },
      { X: 2 },
      { X: 2 },
      { X: 2 },
      { X: 2 },
      { X: 2 },
    ];
    const linq = new Linq(arr);
    const odds = linq.Where("X", ">", 3).Select();
    expect(odds.length).toEqual(8);
  });

  test("Where X starts with", () => {
    const arr = [
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
    const linq = new Linq(arr);
    const odds = linq.Where("X", "startsWith", "te").Select();
    expect(odds.length).toEqual(4);
  });

  test("Where X ends with", () => {
    const arr = [
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
    const linq = new Linq(arr);
    const odds = linq.Where("X", "endsWith", "st").Select();
    expect(odds.length).toEqual(4);
  });

  test("Where X in Array", () => {
    const arr = [
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
    const linq = new Linq(arr);
    const odds = linq.Where("X", "in", [1, 2]).Select();
    expect(odds.length).toEqual(5);
  });

  test("Where X not in Array", () => {
    const arr = [
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
    const linq = new Linq(arr);
    const odds = linq.Where("X", "notIn", [1, 2]).Select();
    expect(odds.length).toEqual(4);
  });
});
