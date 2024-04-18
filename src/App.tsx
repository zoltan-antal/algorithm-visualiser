import './App.css';

import { useState, useEffect, useRef, useCallback } from 'react';

import ArrayOrder from './types/ArrayOrder.ts';
import AlgorithmStates from './types/AlgorithmStates.ts';
import AlgorithmSteps from './types/AlgorithmSteps.ts';

import ARRAY_SIZE from './constants/arraySize.ts';
import VALUE_RANGE from './constants/valueRange.ts';

import { algorithmNames } from './algorithms';
import generateArray from './utils/generateArray.ts';

import Header from './components/Header';
import Aside from './components/Aside';
import Main from './components/Main';
import Footer from './components/Footer';

function App() {
  const [arraySize, setArraySize] = useState(ARRAY_SIZE.default);
  const [maxValue, setMaxValue] = useState(VALUE_RANGE.default);

  const [selectedArrayOrder, setSelectedArrayOrder] =
    useState<ArrayOrder>('unsorted');
  const [selectedAlgorithms, setSelectedAlgorithms] = useState(
    new Set(algorithmNames)
  );

  const algorithmSteps = useRef<AlgorithmSteps>({});
  const currentStep = useRef<number>(0);
  const [algorithmStates, setAlgorithmStates] = useState<AlgorithmStates>({});
  const [processing, setProcessing] = useState<boolean>(false);

  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem('algorithmVisualiserDarkMode') !== null
      ? JSON.parse(localStorage.getItem('algorithmVisualiserDarkMode')!)
      : window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const generateArrays = useCallback(() => {
    const array = generateArray(arraySize, 1, maxValue, selectedArrayOrder);
    setAlgorithmStates(
      Object.fromEntries(
        algorithmNames.map((algorithmName) => [
          algorithmName,
          { array, highlights: [] },
        ])
      )
    );
    algorithmSteps.current = {};
    currentStep.current = 0;
  }, [arraySize, maxValue, selectedArrayOrder]);

  useEffect(() => {
    generateArrays();
  }, [generateArrays]);

  return (
    <>
      <Header darkMode={darkMode} setDarkMode={setDarkMode}></Header>
      <Aside
        processing={processing}
        currentStep={currentStep}
        algorithmStates={algorithmStates}
        algorithmSteps={algorithmSteps}
        arraySize={arraySize}
        setArraySize={setArraySize}
        maxValue={maxValue}
        setMaxValue={setMaxValue}
        selectedAlgorithms={selectedAlgorithms}
        setSelectedAlgorithms={setSelectedAlgorithms}
        selectedArrayOrder={selectedArrayOrder}
        setSelectedArrayOrder={setSelectedArrayOrder}
        generateArrays={generateArrays}
      ></Aside>
      <Main
        maxValue={maxValue}
        selectedAlgorithms={selectedAlgorithms}
        currentStep={currentStep}
        algorithmSteps={algorithmSteps}
        processing={processing}
        setProcessing={setProcessing}
        algorithmStates={algorithmStates}
        setAlgorithmStates={setAlgorithmStates}
        darkMode={darkMode}
      ></Main>
      <Footer></Footer>
    </>
  );
}

export default App;
