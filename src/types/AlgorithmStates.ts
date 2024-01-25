import SelectionSortState from './SelectionSortState';
import BubbleSortState from './BubbleSortState';
import MergeSortState from './MergeSortState';

type AlgorithmStates = {
  selectionSort: SelectionSortState;
  bubbleSort: BubbleSortState;
  mergeSort: MergeSortState;
};

export default AlgorithmStates;
