import { BarChart, Bar, YAxis, ResponsiveContainer } from 'recharts';
import AlgorithmState from '../../types/AlgorithmState';

interface AlgorithmChartProps {
  data: AlgorithmState;
  maxValue: number;
  finished: boolean;
}

const AlgorithmChart = ({
  data = { array: [], highlights: [] },
  maxValue,
  finished,
}: AlgorithmChartProps) => {
  const renderCustomBar = (props: any) => {
    const { index } = props;
    const fillColour = (() => {
      if (finished) {
        return '#16a34a';
      } else if (data.highlights.includes(index)) {
        return '#f97316';
      } else {
        return '#0284c7';
      }
    })();

    return (
      <g>
        <rect
          x={props.x}
          y={props.y}
          width={props.width}
          height={props.height}
          fill={fillColour}
        />
      </g>
    );
  };

  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
          data={data.array.map((value: number, index: number) => ({
            index,
            value,
          }))}
        >
          <YAxis domain={[0, maxValue]} hide />
          <Bar dataKey="value" shape={renderCustomBar} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AlgorithmChart;
