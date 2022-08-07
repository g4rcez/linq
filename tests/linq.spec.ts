import Linq, { range } from "../src";

const reduceSum = (acc: number, el: number) => acc + el;

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
	const arr = [
		{ name: "Foo", surname: "Bar" },
		{ name: "Fu", surname: "Bá" },
		{ name: "Chuck", surname: "Norris" },
		{ name: "Bruce", surname: "Lee" },
		{ name: "Bruce", surname: "Wayne" },
		{ name: "Brucer", surname: "Nothing" },
		{ name: "Peter", surname: "Parker" },
	];
	const arrays = new Linq(arr);
	arr.reverse();
	expect(arr).toEqual(arrays.Reverse().Select());
});

test("Range", () => {
	expect(range("18..40").length).toEqual(23);
});

test("Where with like", () => {
	const arrays = new Linq([
		{ name: "Foo", surname: "Bar" },
		{ name: "Fu", surname: "Bá" },
		{ name: "Chuck", surname: "Norris" },
		{ name: "Bruce", surname: "Lee" },
		{ name: "Bruce", surname: "Wayne" },
		{ name: "Brucer", surname: "Nothing" },
		{ name: "Peter", surname: "Parker" },
	]);
	expect([
		{ name: "Bruce", surname: "Lee" },
		{ name: "Bruce", surname: "Wayne" },
		{ name: "Brucer", surname: "Nothing" },
	]).toEqual(arrays.Where("name", "like", "Bruce").Select());
});
