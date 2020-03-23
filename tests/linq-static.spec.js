const Arrays = require("../build").default;

test("Get sum", () => {
	const arrays = new Arrays([0, 1, 2, 2, 3, 4, 5, 6, 7]);
	expect(30).toBe(arrays.Sum());
});

test("Sum only 2", () => {
	const arrays = new Arrays([0, 1, 2, 2, 3, 4, 5, 6, 7]);
	expect(4).toBe(arrays.Where({ symbol: "===", value: 2 }).Sum());
});
