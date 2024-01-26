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
  merge?: {
    i: number;
    j: number;
    iMax: number;
    jMax: number;
    k: number;
    left: number[];
    right: number[];
  };
};

export default MergeSortState;
