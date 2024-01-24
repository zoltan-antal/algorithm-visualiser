import SelectionSortState from '../types/SelectionSortState';

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

export default selectionSort;
