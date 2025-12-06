import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FishType } from '../types';

interface ChartDataPoint {
  date: string;
  [key: string]: string | number;
}

interface ChartProps {
  data: ChartDataPoint[];
  fishTypes: FishType[];
  title: string;
  xAxisLabel: string;
}

const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

export function Chart({ data, fishTypes, title, xAxisLabel }: ChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm p-6 border border-gray-100 text-center">
        <p className="text-gray-500">Нет данных для отображения</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            domain={[1, 5]}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip
            wrapperStyle={{ outline: "none" }}
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value) => (typeof value === 'number' ? value.toFixed(1) : value)}
          />
          <Legend />
          {fishTypes.map((fish, index) => (
            <Line
              key={fish.id}
              type="monotone"
              dataKey={fish.name_ru}
              stroke={colors[index % colors.length]}
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
