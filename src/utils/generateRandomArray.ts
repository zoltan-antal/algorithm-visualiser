const generateRandomArray = (
  length: number,
  min: number,
  max: number
): number[] => {
  const arr: number[] = [];
  for (let i = 0; i < length; i++) {
    arr[i] = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  if (Math.max(...arr) < (max - min) * 0.9) {
    return generateRandomArray(length, min, max);
  } else {
    return arr;
  }
};

export default generateRandomArray;
