import { useState, useEffect } from 'react';
import BarChart from './components/BarChart.tsx';

import generateArray from './utils/generateArray.ts';
import runAlgorithms from './utils/runAlgorithms.ts';
import { algorithmNames } from './utils/runAlgorithms.ts';

import Arrays from './types/Arrays.ts';

function App() {
  const TIMEOUT = 10;
  const MAX_VALUE = 100;
  const ARRAY_SIZE = 50;

  const [arrays, setArrays] = useState<Arrays>(
    Object.fromEntries(
      algorithmNames.map((algorithmName) => [algorithmName, [] as number[]])
    ) as Arrays
  );

  const generateArrays = () => {
    const randomArray: number[] = generateArray(ARRAY_SIZE, 1, MAX_VALUE);
    setArrays((prevArrays) => {
      const updatedArrays: Arrays = structuredClone(prevArrays);
      Object.keys(updatedArrays).forEach(
        (key) => (updatedArrays[key as keyof Arrays] = randomArray)
      );
      return updatedArrays;
    });
  };
  useEffect(() => {
    generateArrays();
  }, []);

  console.log('Selection sort: ' + arrays.selectionSort);
  console.log('Bubble sort: ' + arrays.bubbleSort);
  console.log('Merge sort: ' + arrays.mergeSort);

  return (
    <>
      <h1>Algorithm Visualiser</h1>
      <button onClick={() => runAlgorithms(arrays, setArrays, TIMEOUT)}>
        Run
      </button>
      <button onClick={() => generateArrays()}>Regenerate arrays</button>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div>
          <h2>Selection sort</h2>
          <BarChart data={arrays.selectionSort} />
        </div>
        <div>
          <h2>Bubble sort</h2>
          <BarChart data={arrays.bubbleSort} />
        </div>
        <div>
          <h2>Merge sort</h2>
          <BarChart data={arrays.mergeSort} />
        </div>
      </div>
    </>
  );
}

export default App;
