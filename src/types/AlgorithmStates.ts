import SelectionSortState from './SelectionSortState';
import BubbleSortState from './BubbleSortState';
import MergeSortState from './MergeSortState';
import InsertionSortState from './InsertionSortState';

type AlgorithmStates = {
  selectionSort: SelectionSortState;
  bubbleSort: BubbleSortState;
  mergeSort: MergeSortState;
  insertionSort: InsertionSortState;
};

export default AlgorithmStates;
