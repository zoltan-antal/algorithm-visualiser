import AlgorithmStates from '../types/AlgorithmStates.ts';

const runAlgorithms = async (
  algorithms: {
    (unsorted: number[]): number[][];
    algorithmName: string;
  }[],
  arrays: AlgorithmStates,
  setArrays: React.Dispatch<React.SetStateAction<AlgorithmStates>>,
  timeout: number
) => {
  const algorithmSteps = Object.fromEntries(
    algorithms.map((algorithm) => [
      algorithm.algorithmName,
      algorithm(arrays[algorithm.algorithmName]),
    ])
  );
  console.log(algorithmSteps);
  const n = Math.max(
    ...Object.values(algorithmSteps).map((steps) => steps.length)
  );

  for (let i = 0; i < n; i++) {
    setArrays((prevStates) => {
      const updatedStates: AlgorithmStates = structuredClone(prevStates);
      Object.entries(algorithmSteps).forEach(([key, value]) => {
        if (value[i]) {
          updatedStates[key] = value[i];
        }
      });
      return updatedStates;
    });
    await new Promise((resolve) => setTimeout(resolve, timeout));
  }
  console.log('Done');
};

export default runAlgorithms;
