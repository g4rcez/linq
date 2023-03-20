export const repeat = <T>(element: T, repeat: number) => {
  const array = [] as T[];
  for (let index = 0; index < repeat; index++) {
    array.push(element);
  }
  return array;
};
