function App() {
  const startArray = generateArray(50, 50);
  console.log('Start');
  console.log(startArray);
  console.log('Selection sort');
  console.log(selectionSort(startArray));
  console.log('Bubble sort');
  console.log(bubbleSort(startArray));
  return <h1>Algorithm Visualiser</h1>;
}

const generateArray = (length: number, range: number) => {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr[i] = Math.floor(Math.random() * (range + 1));
  }
  return arr;
};

const selectionSort = (unsorted: number[]) => {
  const sorted = [...unsorted];
  const n = sorted.length;

  for (let i = 0; i < n; i++) {
    // Assume the current index is the minimum
    let min_index = i;

    // Find the index of the minimum element in the unsorted part
    for (let j = i + 1; j < n; j++) {
      if (sorted[j] < sorted[min_index]) {
        min_index = j;
      }
    }

    // Swap the found element with the element at the current index
    [sorted[i], sorted[min_index]] = [sorted[min_index], sorted[i]];
  }

  return sorted;
};

const bubbleSort = (unsorted: number[]) => {
  const sorted = [...unsorted];
  const n = sorted.length;

  // Continue while at least one swap is made, i.e., the array is unsorted
  let swap = true;
  while (swap) {
    swap = false;
    // Iterate through the whole array
    for (let j = 0; j < n - 1; j++) {
      // Swap neighbouring elements if they're out of order
      if (sorted[j] > sorted[j + 1]) {
        swap = true;
        [sorted[j], sorted[j + 1]] = [sorted[j + 1], sorted[j]];
      }
    }
  }

  return sorted;
};

export default App;
