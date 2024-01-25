import _ from 'lodash';

import MergeSortState from '../types/MergeSortState';

const mergeSort = (inputState: any) => {
  if (!inputState.processing) {
    return inputState;
  }

  const state = structuredClone(inputState) as MergeSortState;

  // If root node is sorted, stop process
  if (state.tree.sorted) {
    state.processing = false;
    return state;
  }

  const node = _.get(state, state.path);

  // If node already sorted, replace in / remove from path
  if (node.sorted) {
    switch (state.path[state.path.length - 1]) {
      case 'left':
        state.path[state.path.length - 1] = 'right';
        return state;

      case 'right':
        state.path.pop();
        return state;
    }
  }

  // BASE CASE
  if (node.start === node.end) {
    _.set(state, [...state.path, 'sorted'], true);
    return state;
  }

  // MERGE STEP
  if (node.left && node.left.sorted && node.right && node.right.sorted) {
    let i = 0;
    let j = 0;
    const iMax = node.left!.end - node.left!.start + 1;
    const jMax = node.right!.end - node.right!.start + 1;
    const left: number[] = state.arr.slice(
      node.left!.start,
      node.left!.end + 1
    );
    const right: number[] = state.arr.slice(
      node.right!.start,
      node.right!.end + 1
    );
    for (let k = node.left!.start; k <= node.right!.end; k++) {
      if (i === iMax) {
        state.arr[k] = right[j];
        j++;
      } else if (j === jMax) {
        state.arr[k] = left[i];
        i++;
      } else if (left[i] < right[j]) {
        state.arr[k] = left[i];
        i++;
      } /* right[j] <= left[i] */ else {
        state.arr[k] = right[j];
        j++;
      }
    }
    _.unset(state, [...state.path, 'left']);
    _.unset(state, [...state.path, 'right']);
    _.set(state, [...state.path, 'sorted'], true);
    return state;
  }

  // RECURSIVE STEP
  const mid = node.start! + Math.ceil((node.end! - node.start!) / 2);
  const left = { start: node.start, end: mid - 1, sorted: false };
  const right = { start: mid, end: node.end, sorted: false };
  _.set(state, [...state.path, 'left'], left);
  _.set(state, [...state.path, 'right'], right);
  state.path.push('left');
  return state;

  // switch (node.step) {
  //   case 'split': {
  //     if (node.start === node.end) {
  //       _.set(state, [...state.path, 'step'], 'merge');
  //       switch (state.path[state.path.length - 1]) {
  //         case 'left':
  //           state.path[state.path.length - 1] = 'right';
  //           break;

  //         case 'right':
  //           state.path.pop();
  //           _.set(state, [...state.path, 'step'], 'merge');
  //           break;
  //       }
  //       return state;
  //     }
  //     const mid = node.start! + Math.ceil((node.end! - node.start!) / 2);
  //     const left = { start: node.start, end: mid - 1, step: 'split' };
  //     const right = { start: mid, end: node.end, step: 'split' };
  //     _.set(state, [...state.path, 'left'], left);
  //     _.set(state, [...state.path, 'right'], right);
  //     state.path.push('left');
  //     return state;
  //   }
  //   case 'merge': {
  //     let i = 0;
  //     let j = 0;
  //     const iMax = node.left!.end - node.left!.start + 1;
  //     const jMax = node.right!.end - node.right!.start + 1;
  //     const left: number[] = state.arr.slice(
  //       node.left!.start,
  //       node.left!.end + 1
  //     );
  //     const right: number[] = state.arr.slice(
  //       node.right!.start,
  //       node.right!.end + 1
  //     );
  //     for (let k = node.left!.start; k <= node.right!.end; k++) {
  //       if (i === iMax) {
  //         state.arr[k] = right[j];
  //         j++;
  //         break;
  //       } else if (j === jMax) {
  //         state.arr[k] = left[i];
  //         i++;
  //         break;
  //       } else if (left[i] < right[j]) {
  //         state.arr[k] = left[i];
  //         i++;
  //       } /* right[j] <= left[i] */ else {
  //         state.arr[k] = right[j];
  //         j++;
  //       }
  //     }
  //     _.unset(state, [...state.path, 'left']);
  //     _.unset(state, [...state.path, 'right']);
  //     switch (state.path[state.path.length - 1]) {
  //       case 'left':
  //         state.path[state.path.length - 1] = 'right';
  //         break;

  //       case 'right':
  //         state.path.pop();
  //         _.set(state, [...state.path, 'step'], 'merge');
  //         state.path[state.path.length - 1] = 'left';
  //         break;
  //     }
  //     return state;
  //   }
  // }
};

mergeSort.algorithmName = 'mergeSort';

// const mergeSort = (unsorted: number[]) => {
//   const n = unsorted.length;

//   // Base case
//   if (n == 1) {
//     return unsorted;
//   }

//   // Recursively sort the two halves of the array
//   const left = mergeSort(unsorted.slice(0, n / 2));
//   const right = mergeSort(unsorted.slice(n / 2));

//   // Merge the two sorted halves
//   const sorted: number[] = [];
//   let i = 0;
//   let j = 0;
//   const iMax = left.length;
//   const jMax = right.length;
//   for (let k = 0; k < n; k++) {
//     if (i === iMax) {
//       sorted.push(...right.slice(j, jMax));
//       break;
//     } else if (j === jMax) {
//       sorted.push(...left.slice(i, iMax));
//       break;
//     } else if (left[i] < right[j]) {
//       sorted.push(left[i]);
//       i++;
//     } /* right[j] <= left[i] */ else {
//       sorted.push(right[j]);
//       j++;
//     }
//   }

//   return sorted;
// };

export default mergeSort;
