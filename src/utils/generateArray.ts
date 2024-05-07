import generateRandomArray from './generateRandomArray';

import ArrayOrder from '../types/ArrayOrder';

const generateArray = (
  size: number,
  min: number,
  max: number,
  mode: ArrayOrder
) => {
  let array;
  switch (mode) {
    case 'unsorted':
      array = generateRandomArray(size, min, max);
      break;

    case 'sorted':
      array = generateRandomArray(size, min, max);
      array.sort((a, b) => a - b);
      break;

    case 'reversed':
      array = generateRandomArray(size, min, max);
      array.sort((a, b) => b - a);
      break;

    case 'equal':
      min = Math.floor(max * 0.75);
      array = new Array(size).fill(
        Math.floor(Math.random() * (max - min + 1)) + min
      );
      break;

    case 'nearlySorted': {
      array = generateRandomArray(size, min, max);
      array.sort((a: number, b: number) => a - b);
      const inversionCount = Math.round(Math.log(size)) - 1;
      for (let i = 0; i < inversionCount; i++) {
        const a = Math.floor(Math.random() * size);
        const b = Math.floor(Math.random() * size);
        if (a === b) {
          i--;
          continue;
        }
        [array[a], array[b]] = [array[b], array[a]];
      }
      break;
    }
  }
  return array;
};

export default generateArray;
