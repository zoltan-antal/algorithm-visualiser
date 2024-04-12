import AlgorithmState from '../types/AlgorithmState';

const selectionSort = (unsorted: number[]) => {
  const sorted = [...unsorted];
  const n = sorted.length;
  const steps: AlgorithmState[] = [];

  for (let i = 0; i < n; i++) {
    // Assume the current index is the minimum
    let minIndex = i;

    // Find the index of the minimum element in the unsorted part
    for (let j = i + 1; j < n; j++) {
      steps.push({ array: [...sorted], highlights: [i, j, minIndex] });
      if (sorted[j] < sorted[minIndex]) {
        minIndex = j;
        steps.push({ array: [...sorted], highlights: [i, j, minIndex] });
      }
    }

    // Swap the found element with the element at the current index
    [sorted[i], sorted[minIndex]] = [sorted[minIndex], sorted[i]];
    steps.push({ array: [...sorted], highlights: [i, minIndex] });
  }

  return steps;
};

selectionSort.algorithmName = 'selectionSort';
selectionSort.displayName = 'Selection sort';

export default selectionSort;
