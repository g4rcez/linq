import Linq from "../build";

const reduceSum = (acc: number, el: number) => acc + el;

test("Aggregate sum - instance", () => {
	const arr = [0, 1, 2, 3, 4, 5, 6, 7];
	const linq = new Linq(arr);
	const sum = linq.Aggregate(reduceSum, 0);
	expect(sum).toEqual(28);
});
