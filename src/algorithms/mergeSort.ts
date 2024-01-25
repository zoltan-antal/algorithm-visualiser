const mergeSort = (unsorted: number[]) => {
  const n = unsorted.length;

  // Base case
  if (n == 1) {
    return unsorted;
  }

  // Recursively sort the two halves of the array
  const left = mergeSort(unsorted.slice(0, n / 2));
  const right = mergeSort(unsorted.slice(n / 2));

  // Merge the two sorted halves
  const sorted: number[] = [];
  let i = 0;
  let j = 0;
  const iMax = left.length;
  const jMax = right.length;
  for (let k = 0; k < n; k++) {
    if (i === iMax) {
      sorted.push(...right.slice(j, jMax));
      break;
    } else if (j == jMax) {
      sorted.push(...left.slice(i, iMax));
      break;
    } else if (left[i] < right[j]) {
      sorted.push(left[i]);
      i++;
    } /* right[j] <= left[i] */ else {
      sorted.push(right[j]);
      j++;
    }
  }

  return sorted;
};

export default mergeSort;
