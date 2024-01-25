type MergeSortNode = {
  start: number;
  end: number;
  sorted: boolean;
  left?: MergeSortNode;
  right?: MergeSortNode;
};

type MergeSortState = {
  processing: boolean;
  arr: number[];
  root: MergeSortNode;
  path: string[];
};

export default MergeSortState;
