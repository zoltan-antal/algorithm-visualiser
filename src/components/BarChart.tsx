import { BarChart, Bar } from 'recharts';

const BarChartComponent = ({ data }: any) => {
  return (
    <BarChart
      width={300}
      height={400}
      data={data.map((value: any, index: any) => ({ index: index + 1, value }))}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  );
};

export default BarChartComponent;
