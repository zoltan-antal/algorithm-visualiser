import InsertionSortState from '../types/InsertionSortState';

// "STEPPING" ALGORITHM USING STATE

const insertionSort = (inputState: any): InsertionSortState => {
  if (!inputState.processing) {
    return inputState;
  }

  const state = structuredClone(inputState) as InsertionSortState;

  if (state.j < 0 || state.arr[state.j] <= state.key) {
    state.arr[state.j + 1] = state.key;
    if (state.i >= state.n - 1) {
      state.processing = false;
      return state;
    }
    state.i++;
    state.key = state.arr[state.i];
    state.j = state.i - 1;
    return state;
  }
  state.arr[state.j + 1] = state.arr[state.j];
  state.j--;
  return state;
};

insertionSort.algorithmName = 'insertionSort';

// STANDARD ALGORITHM

// const insertionSort = (unsorted: number[]) => {
//   const sorted = [...unsorted];
//   const n = sorted.length;

//   for (let i = 1; i < n; i++) {
//     const key = sorted[i];
//     let j = i - 1;
//     while (j >= 0 && sorted[j] > key) {
//       sorted[j + 1] = sorted[j];
//       j--;
//     }
//     sorted[j + 1] = key;
//   }

//   return sorted;
// };

export default insertionSort;
