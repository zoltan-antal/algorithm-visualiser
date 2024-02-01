import AlgorithmState from '../types/AlgorithmState';

const insertionSort = (unsorted: number[]) => {
  const sorted = [...unsorted];
  const n = sorted.length;
  const steps: AlgorithmState[] = [];

  for (let i = 1; i < n; i++) {
    // Store the current element
    const key = sorted[i];
    let j = i - 1;
    // Iterate through elements in reverse order whilst they are greater than key
    while (j >= 0 && sorted[j] > key) {
      // Shift element to right to make space for the key
      sorted[j + 1] = sorted[j];
      steps.push({ array: [...sorted], highlights: [j, j + 1, i] });
      j--;
    }
    // Place the key in its correct position in the space left for it
    sorted[j + 1] = key;
    steps.push({ array: [...sorted], highlights: [j + 1, i] });
  }

  steps.push({ array: [...sorted], highlights: [] });
  return steps;
};

insertionSort.algorithmName = 'insertionSort';
insertionSort.displayName = 'Insertion sort';

export default insertionSort;
