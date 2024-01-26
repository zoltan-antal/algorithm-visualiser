import SelectionSortState from '../types/SelectionSortState';

// "STEPPING" ALGORITHM USING STATE

const selectionSort = (inputState: any): SelectionSortState => {
  if (!inputState.processing) {
    return inputState;
  }

  const state = structuredClone(inputState) as SelectionSortState;

  if (state.arr[state.j] < state.arr[state.minIndex]) {
    state.minIndex = state.j;
  }
  if (state.j >= state.n - 1) {
    [state.arr[state.i], state.arr[state.minIndex]] = [
      state.arr[state.minIndex],
      state.arr[state.i],
    ];
    if (state.i >= state.n - 1) {
      state.processing = false;
      return state;
    }
    state.i++;
    state.j = state.i + 1;
    state.minIndex = state.i;
    return state;
  }
  state.j++;
  return state;
};

selectionSort.algorithmName = 'selectionSort';

// STANDARD ALGORITHM

// const selectionSort = (unsorted: number[]) => {
//   const sorted = [...unsorted];
//   const n = sorted.length;

//   for (let i = 0; i < n; i++) {
//     // Assume the current index is the minimum
//     let minIndex = i;

//     // Find the index of the minimum element in the unsorted part
//     for (let j = i + 1; j < n; j++) {
//       if (sorted[j] < sorted[minIndex]) {
//         minIndex = j;
//       }
//     }

//     // Swap the found element with the element at the current index
//     [sorted[i], sorted[minIndex]] = [sorted[minIndex], sorted[i]];
//   }

//   return sorted;
// };

export default selectionSort;
