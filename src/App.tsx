import { useState } from 'react';

interface SelectionSortState {
  arr: number[];
  n: number;
  i: number;
  j: number;
  min_index: number;
  processing: boolean;
}

interface AlgorithmStates {
  selectionSort: SelectionSortState;
}

type Arrays = {
  [K in keyof AlgorithmStates]: number[];
};

function App() {
  const randomArray = generateArray(5, 50);
  const [arrays, setArrays] = useState<Arrays>({
    selectionSort: [...randomArray],
  });

  const runAlgorithms = async () => {
    const algorithms = [selectionSort];

    const algorithmStates: AlgorithmStates = {
      selectionSort: {
        arr: [...randomArray],
        n: randomArray.length,
        i: 0,
        j: 1,
        min_index: 0,
        processing: true,
      },
    };

    while (Object.values(algorithmStates).some((state) => state.processing)) {
      for (const algorithm of algorithms) {
        const algorithmName = algorithm.name as keyof typeof algorithmStates;
        const newState = algorithm(algorithmStates[algorithmName]);
        algorithmStates[algorithmName] = newState;
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      setArrays((prevArrays) => {
        const updatedArrays: Arrays = { ...prevArrays };
        Object.entries(algorithmStates).forEach(([key, value]) => {
          updatedArrays[key as keyof Arrays] = value.arr;
        });
        return updatedArrays;
      });
    }
    console.log('Done');
  };

  console.log('Selection sort: ' + arrays.selectionSort);

  return (
    <>
      <h1>Algorithm Visualiser</h1>
      <button onClick={() => runAlgorithms()}>Run</button>
    </>
  );
}

const generateArray = (length: number, range: number) => {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr[i] = Math.floor(Math.random() * (range + 1));
  }
  return arr;
};

// const selectionSort = (unsorted: number[]) => {
//   const sorted = [...unsorted];
//   const n = sorted.length;

//   for (let i = 0; i < n; i++) {
//     // Assume the current index is the minimum
//     let min_index = i;

//     // Find the index of the minimum element in the unsorted part
//     for (let j = i + 1; j < n; j++) {
//       if (sorted[j] < sorted[min_index]) {
//         min_index = j;
//       }
//     }

//     // Swap the found element with the element at the current index
//     [sorted[i], sorted[min_index]] = [sorted[min_index], sorted[i]];
//   }

//   return sorted;
// };

const selectionSort = (inputState: AlgorithmStates['selectionSort']) => {
  const state = structuredClone(inputState);

  if (state.arr[state.j] < state.arr[state.min_index]) {
    state.min_index = state.j;
  }
  if (state.j >= state.n - 1) {
    [state.arr[state.i], state.arr[state.min_index]] = [
      state.arr[state.min_index],
      state.arr[state.i],
    ];
    if (state.i >= state.n - 1) {
      state.processing = false;
      return state;
    }
    state.i++;
    state.j = state.i + 1;
    state.min_index = state.i;
    return state;
  }
  state.j++;
  return state;
};

// const bubbleSort = (unsorted: number[]) => {
//   const sorted = [...unsorted];
//   const n = sorted.length;

//   // Continue while at least one swap is made, i.e., the array is unsorted
//   let swap = true;
//   while (swap) {
//     swap = false;
//     // Iterate through the whole array
//     for (let j = 0; j < n - 1; j++) {
//       // Swap neighbouring elements if they're out of order
//       if (sorted[j] > sorted[j + 1]) {
//         swap = true;
//         [sorted[j], sorted[j + 1]] = [sorted[j + 1], sorted[j]];
//       }
//     }
//   }

//   return sorted;
// };

export default App;
