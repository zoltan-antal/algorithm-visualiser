import AlgorithmState from '../types/AlgorithmState';

const insertionSort = (unsorted: number[]) => {
  const sorted = [...unsorted];
  const n = sorted.length;
  const steps: AlgorithmState[] = [];

  for (let i = 1; i < n; i++) {
    let j = i - 1;
    steps.push({ array: [...sorted], highlights: [j, i] });
    // Iterate through elements in reverse order whilst they are greater than the element travelling down
    while (j >= 0 && sorted[j] > sorted[j + 1]) {
      if (j < i - 1) {
        steps.push({ array: [...sorted], highlights: [j, j + 1, i] });
      }
      // Swap elements to propagate the new element downwards
      [sorted[j], sorted[j + 1]] = [sorted[j + 1], sorted[j]];
      j--;
    }
  }

  return steps;
};

insertionSort.algorithmName = 'insertionSort';
insertionSort.displayName = 'Insertion sort';

export default insertionSort;
