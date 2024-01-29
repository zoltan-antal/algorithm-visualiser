import { BarChart, Bar } from 'recharts';

const BarChartComponent = ({ data }: any) => {
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
      <Bar dataKey="value" shape={renderCustomBar} />
    </BarChart>
  );
};

export default BarChartComponent;
