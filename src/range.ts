import { createChars, isNumberOrString } from "./utils";

export const range = <T extends number | string>(
	firstOrLength: number | string,
	secondOrSteps?: number | string,
	jumps: number = 1,
): T[] => {
	if (secondOrSteps === undefined) {
		const [x, y, jp] = (firstOrLength as string).split("..");
		if (jp === undefined) {
			return createChars(x, y, 1) as any;
		}
		return createChars(x, jp, Number.parseInt(y, 10)) as any;
	}
	if (isNumberOrString(firstOrLength) && isNumberOrString(secondOrSteps)) {
		return createChars(`${firstOrLength}`, `${secondOrSteps}`, jumps) as T[];
	}
	return Array.from({ length: firstOrLength as number }, (_, i) => i * Math.abs(secondOrSteps as number)) as T[];
};
