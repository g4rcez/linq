import { isNumber, isNumberOrString } from "./utils";

const getInSequence = (a: string, b: string): [number, number] => {
  let x = Number.parseInt(a, 10);
  let y = Number.parseInt(b, 10);
  return x > y ? [y, x] : [x, y];
};

const individualChars = (charA: string, charZ: string, jumps = 1) => {
  const a = [];
  let i = charA.charCodeAt(0);
  const j = charZ.charCodeAt(0);
  for (; i <= j; i += jumps) {
    a.push(String.fromCharCode(i));
  }
  if (isNumber(charA) && isNumber(charZ)) {
    return a.map((x) => Number.parseInt(x));
  }
  return a;
};

const createChars = (charA: string, charZ: string, jumps = 1) => {
  let abs = Math.abs(jumps);
  if (charA.length > 1 || charZ.length > 1) {
    if (isNumber(charA) && isNumber(charZ)) {
      const a = [];
      const [first, second] = getInSequence(charA, charZ);
      for (let i = first; i <= second; i += abs) {
        a.push(i);
      }
      return a;
    }
  }
  return individualChars(charA, charZ, abs);
};

export const range = <T extends number | string>(
  firstOrLength: T,
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
