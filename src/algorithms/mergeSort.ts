import AlgorithmState from '../types/AlgorithmState';

const mergeSort = (unsorted: number[]) => {
  const steps: AlgorithmState[] = [{ array: [...unsorted], highlights: [] }];

  const mergeSortRecursive = (unsorted: number[], start: number) => {
    const n = unsorted.length;

    // Base case: if the array size is 1, no sorting is required
    if (n == 1) {
      steps.push({
        array: [...steps[steps.length - 1].array],
        highlights: [start],
      });
      return unsorted;
    }

    // Recursively sort the two halves of the array
    const left = mergeSortRecursive(unsorted.slice(0, n / 2), start);
    const right = mergeSortRecursive(
      unsorted.slice(n / 2),
      start + Math.floor(n / 2)
    );

    // Merge the two sorted halves
    const sorted: number[] = [];
    let i = 0;
    let j = 0;
    const iMax = left.length;
    const jMax = right.length;
    for (let k = 0; k < n; k++) {
      if (i === iMax) {
        sorted.push(right[j]);
        j++;
      } else if (j === jMax) {
        sorted.push(left[i]);
        i++;
      } else if (left[i] < right[j]) {
        sorted.push(left[i]);
        i++;
      } /* right[j] <= left[i] */ else {
        sorted.push(right[j]);
        j++;
      }

      const array = [...steps[steps.length - 1].array];
      array[start + k] = sorted[k];
      steps.push({
        array: array,
        highlights: [start, start + k, start + unsorted.length - 1],
      });
    }

    return sorted;
  };
  mergeSortRecursive(unsorted, 0);

  return steps.slice(1);
};

mergeSort.algorithmName = 'mergeSort';
mergeSort.displayName = 'Merge sort';

export default mergeSort;
