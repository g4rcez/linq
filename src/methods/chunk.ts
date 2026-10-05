/*
 * @param array: the list to apply chunks
 * @param size: the size of each chunk
 * @returns array with arrays and the length as the same of `size`
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  if (!Number.isSafeInteger(size) || size <= 0) throw new RangeError("Chunk size must be a positive integer");

  const chunks: T[][] = [];
  let current: T[] = [];
  for (const item of array) {
    current.push(item);
    if (current.length === size) {
      chunks.push(current);
      current = [];
    }
  }
  if (current.length > 0) chunks.push(current);
  return chunks;
};
