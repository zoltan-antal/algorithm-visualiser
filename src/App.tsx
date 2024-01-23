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
    const temp = sorted[i];
    sorted[i] = sorted[min_index];
    sorted[min_index] = temp;
  }

  return sorted;
};

const bubbleSort = (unsorted: number[]) => {
  const sorted = [...unsorted];
  const n = sorted.length;

  let swap = true;
  while (swap) {
    swap = false;
    for (let j = 0; j < n - 1; j++) {
      if (sorted[j] > sorted[j + 1]) {
        swap = true;
        const temp = sorted[j];
        sorted[j] = sorted[j + 1];
        sorted[j + 1] = temp;
      }
    }
  }

  return sorted;
};

export default App;
