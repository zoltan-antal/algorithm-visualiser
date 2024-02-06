import { BarChart, Bar, YAxis } from 'recharts';

import AlgorithmState from '../types/AlgorithmState';

interface AlgorithmChartProps {
  data: AlgorithmState;
  maxValue: number;
}

const AlgorithmChart = ({ data, maxValue }: AlgorithmChartProps) => {
  const renderCustomBar = (props: any) => {
    const { index } = props;

    return (
      <g>
        <rect
          {...props}
          fill={data.highlights.includes(index) ? 'red' : '#8884d8'}
        />
      </g>
    );
  };

  return (
    <BarChart
      width={300}
      height={250}
      data={data.array.map((value: number, index: number) => ({
        index,
        value,
      }))}
    >
      <YAxis domain={[0, maxValue]} hide />
      <Bar dataKey="value" shape={renderCustomBar} />
    </BarChart>
  );
};

export default AlgorithmChart;
