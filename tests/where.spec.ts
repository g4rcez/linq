import Linq from "../build";

const reduceSum = (acc: number, el: number) => acc + el;

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