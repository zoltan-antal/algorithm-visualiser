const selectionSort = (unsorted: number[]) => {
  const sorted = [...unsorted];
  const n = sorted.length;
  const steps = [];

  for (let i = 0; i < n; i++) {
    // Assume the current index is the minimum
    let minIndex = i;

    // Find the index of the minimum element in the unsorted part
    for (let j = i + 1; j < n; j++) {
      if (sorted[j] < sorted[minIndex]) {
        minIndex = j;
      }
      steps.push([...sorted]);
    }

    // Swap the found element with the element at the current index
    [sorted[i], sorted[minIndex]] = [sorted[minIndex], sorted[i]];
    steps.push([...sorted]);
  }

  return steps;
};

selectionSort.algorithmName = 'selectionSort';

export default selectionSort;
