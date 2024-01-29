const bubbleSort = (unsorted: number[]) => {
  const sorted = [...unsorted];
  const n = sorted.length;
  const steps = [];

  // Continue while at least one swap is made, i.e., the array is unsorted
  let swap = true;
  let i = 0;
  while (swap) {
    swap = false;
    // Iterate through the whole array
    for (let j = 0; j < n - i - 1; j++) {
      // Swap neighbouring elements if they're out of order
      if (sorted[j] > sorted[j + 1]) {
        swap = true;
        [sorted[j], sorted[j + 1]] = [sorted[j + 1], sorted[j]];
      }
      steps.push([...sorted]);
    }
    i++;
  }

  return steps;
};

bubbleSort.algorithmName = 'bubbleSort';

export default bubbleSort;
