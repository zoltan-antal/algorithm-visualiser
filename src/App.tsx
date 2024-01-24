import { useState } from 'react';

import generateArray from './utils/generateArray.ts';
import runAlgorithms from './utils/runAlgorithms.ts';

import Arrays from './types/Arrays.ts';

function App() {
  const randomArray = generateArray(5, 1, 50);
  const [arrays, setArrays] = useState<Arrays>({
    selectionSort: [...randomArray],
    bubbleSort: [...randomArray],
  });

  console.log('Selection sort: ' + arrays.selectionSort);
  console.log('Bubble sort: ' + arrays.bubbleSort);

  return (
    <>
      <h1>Algorithm Visualiser</h1>
      <button onClick={() => runAlgorithms(randomArray, setArrays)}>Run</button>
    </>
  );
}

export default App;
