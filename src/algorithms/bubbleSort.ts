import BubbleSortState from '../types/BubbleSortState';

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

export default bubbleSort;
