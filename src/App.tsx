import { useState } from 'react';

type SelectionSortState = {
  processing: boolean;
  arr: number[];
  n: number;
  i: number;
  j: number;
  min_index: number;
};

type BubbleSortState = {
  processing: boolean;
  arr: number[];
  n: number;
  i: number;
  j: number;
  swap: boolean;
};

type AlgorithmStates = {
  selectionSort: SelectionSortState;
  bubbleSort: BubbleSortState;
};

type Arrays = {
  [K in keyof AlgorithmStates]: number[];
};

function App() {
  const randomArray = generateArray(5, 1, 50);
  const arrayLength = randomArray.length;
  const [arrays, setArrays] = useState<Arrays>({
    selectionSort: [...randomArray],
    bubbleSort: [...randomArray],
  });

  const runAlgorithms = async () => {
    const algorithms = [selectionSort, bubbleSort];

    const algorithmStates: AlgorithmStates = {
      selectionSort: {
        processing: true,
        arr: [...randomArray],
        n: arrayLength,
        i: 0,
        j: 1,
        min_index: 0,
      },
      bubbleSort: {
        processing: true,
        arr: [...randomArray],
        n: arrayLength,
        i: 0,
        j: 0,
        swap: true,
      },
    };

    while (Object.values(algorithmStates).some((state) => state.processing)) {
      for (const algorithm of algorithms) {
        const algorithmName = algorithm.name as keyof typeof algorithmStates;
        const newState = algorithm(algorithmStates[algorithmName]);
        if (!newState.processing) {
          console.log(algorithmName + ' DONE');
        }
        algorithmStates[algorithmName] = newState as any;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));

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
  console.log('Bubble sort: ' + arrays.bubbleSort);

  return (
    <>
      <h1>Algorithm Visualiser</h1>
      <button onClick={() => runAlgorithms()}>Run</button>
    </>
  );
}

const generateArray = (length: number, min: number, max: number) => {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr[i] = Math.floor(Math.random() * (max - min + 1)) + min;
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

const selectionSort = (inputState: any) => {
  if (!inputState.processing) {
    return inputState;
  }

  const state = structuredClone(inputState) as SelectionSortState;

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
//   let i = 0;
//   while (swap) {
//     swap = false;
//     // Iterate through the whole array
//     for (let j = 0; j < n - i - 1; j++) {
//       // Swap neighbouring elements if they're out of order
//       if (sorted[j] > sorted[j + 1]) {
//         swap = true;
//         [sorted[j], sorted[j + 1]] = [sorted[j + 1], sorted[j]];
//       }
//     }
//     i++;
//   }

//   return sorted;
// };

const bubbleSort = (inputState: any) => {
  if (!inputState.processing) {
    return inputState;
  }

  const state = structuredClone(inputState) as BubbleSortState;

  if (state.arr[state.j] > state.arr[state.j + 1]) {
    state.swap = true;
    [state.arr[state.j], state.arr[state.j + 1]] = [
      state.arr[state.j + 1],
      state.arr[state.j],
    ];
  }
  if (state.j >= state.n - 2 - state.i) {
    if (!state.swap) {
      state.processing = false;
      return state;
    }
    state.i++;
    state.j = 0;
    state.swap = false;
    return state;
  }
  state.j++;
  return state;
};

export default App;
