export const reverse = <T>(a: T[]) => {
  const array = [...a];
  let left = null;
  let right = null;
  let length = array.length;
  for (left = 0; left < length / 2; left += 1) {
    right = length - 1 - left;
    let temporary = array[left];
    array[left] = array[right];
    array[right] = temporary;
  }
  return array;
};
