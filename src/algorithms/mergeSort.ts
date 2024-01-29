const mergeSort = (unsorted: number[]) => {
  const steps = [[...unsorted]];

  const mergeSortRecursive = (
    unsorted: number[],
    steps: number[][],
    start: number
  ) => {
    const n = unsorted.length;

    // Base case
    if (n == 1) {
      steps.push([...steps[steps.length - 1]]);
      return unsorted;
    }

    // Recursively sort the two halves of the array
    const left = mergeSortRecursive(unsorted.slice(0, n / 2), steps, start);
    const right = mergeSortRecursive(
      unsorted.slice(n / 2),
      steps,
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

      const newStep = [...steps[steps.length - 1]];
      newStep[start + k] = sorted[k];
      steps.push(newStep);
    }

    return sorted;
  };
  mergeSortRecursive(unsorted, steps, 0);

  return steps;
};

mergeSort.algorithmName = 'mergeSort';

export default mergeSort;
