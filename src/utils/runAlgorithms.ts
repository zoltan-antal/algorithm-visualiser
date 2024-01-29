import AlgorithmState from '../types/AlgorithmState';
import AlgorithmStates from '../types/AlgorithmStates.ts';

const runAlgorithms = async (
  algorithms: {
    (unsorted: number[]): AlgorithmState[];
    algorithmName: string;
  }[],
  algorithmStates: AlgorithmStates,
  setAlgorithmStates: React.Dispatch<React.SetStateAction<AlgorithmStates>>,
  timeout: number,
  setProcessing: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setProcessing(true);

  const algorithmSteps = Object.fromEntries(
    algorithms.map((algorithm) => [
      algorithm.algorithmName,
      algorithm(algorithmStates[algorithm.algorithmName].array),
    ])
  );
  const n = Math.max(
    ...Object.values(algorithmSteps).map((steps) => steps.length)
  );

  for (let i = 0; i < n; i++) {
    setAlgorithmStates((prevStates) => {
      const updatedStates: AlgorithmStates = structuredClone(prevStates);
      Object.entries(algorithmSteps).forEach(([key, steps]) => {
        if (steps[i]) {
          updatedStates[key] = steps[i];
        }
      });
      return updatedStates;
    });
    await new Promise((resolve) => setTimeout(resolve, timeout));
  }

  setProcessing(false);
};

export default runAlgorithms;
