import { useState } from 'react';
import BarChart from './components/BarChart.tsx';

import generateArray from './utils/generateArray.ts';
import runAlgorithms from './utils/runAlgorithms.ts';

import Arrays from './types/Arrays.ts';

function App() {
  const randomArray = generateArray(10, 1, 50);
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
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div>
          <h2>Selection sort</h2>
          <BarChart data={arrays.selectionSort} />
        </div>
        <div>
          <h2>Bubble sort</h2>
          <BarChart data={arrays.bubbleSort} />
        </div>
      </div>
    </>
  );
}

export default App;
