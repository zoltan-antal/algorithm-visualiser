import AlgorithmState from '../types/AlgorithmState';

const heapSort = (unsorted: number[]) => {
  const sorted = [...unsorted];
  const n = sorted.length;
  const steps: AlgorithmState[] = [];

  // Initialise variables for the heap building phase
  let start = Math.floor(n / 2); // last non-leaf node + 1 ((n - 2) / 2 + 1)
  let end = n - 1;

  while (end > 0) {
    // HEAP CONSTRUCTION
    if (start > 0) {
      // Decrement start
      // - the element at start will be percolated down during Heapify
      start--;
    } /* HEAP EXTRACTION */ else {
      // Swap first and last elements of the heap
      // - the first element will be percolated down during Heapify
      [sorted[start], sorted[end]] = [sorted[end], sorted[start]];
      steps.push({ array: [...sorted], highlights: [start, end] });
      // Decrement end so that the element moved to the end will remain there
      end--;
    }

    // HEAPIFY
    // Start at the root of the heap
    let curr = start;
    while (curr * 2 + 1 <= end) {
      // Select the child with the larger value
      let child = curr * 2 + 1;
      if (child + 1 <= end) {
        steps.push({
          array: [...sorted],
          highlights: [start, end, curr, child, child + 1],
        });
        if (sorted[child + 1] > sorted[child]) {
          child++;
        }
      }
      steps.push({ array: [...sorted], highlights: [start, end, curr, child] });
      // Swap current node with the larger child if necessary
      if (sorted[child] > sorted[curr]) {
        [sorted[curr], sorted[child]] = [sorted[child], sorted[curr]];
        steps.push({
          array: [...sorted],
          highlights: [start, end, curr, child],
        });
        curr = child;
      } /* Break if the heap property is satisfied */ else {
        break;
      }
    }
  }

  return steps;
};

heapSort.algorithmName = 'heapSort';
heapSort.displayName = 'Heap sort';

export default heapSort;
