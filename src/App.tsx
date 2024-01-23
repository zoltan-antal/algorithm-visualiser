function App() {
  const startArray = generateArray(50, 50);
  return <h1>Algorithm Visualiser</h1>;
}

const generateArray = (length: number, range: number) => {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr[i] = Math.floor(Math.random() * (range + 1));
  }
  return arr;
};

export default App;
