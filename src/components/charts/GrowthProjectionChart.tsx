import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';

interface Props {
  data: {
    [key: string]: {
      conservative: number;
      expected: number;
      optimistic: number;
    };
  };
}

function GrowthProjectionChart({ data }: Props) {
  const chartData = Object.entries(data)
    .sort(([a], [b]) => {
      const order = { '1year': 1, '3year': 2, '5year': 3, '10year': 4 };
      return (order[a as keyof typeof order] || 5) - (order[b as keyof typeof order] || 5);
    })
    .map(([period, values]) => ({
      period: period.replace('year', 'Y'),
      Conservative: values.conservative,
      Expected: values.expected,
      Optimistic: values.optimistic,
      range: values.optimistic - values.conservative,
    }));

  const renderTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-4 shadow-xl rounded-xl border border-slate-200"
        >
          <p className="font-semibold text-slate-900 mb-2">{label} Return Projections</p>
          <div className="space-y-1">
            {payload
              .sort((a: any, b: any) => b.value - a.value)
              .map((entry: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm font-medium">{entry.name}:</span>
                  </div>
                  <span className="font-bold" style={{ color: entry.color }}>
                    +{entry.value}%
                  </span>
                </div>
              ))}
          </div>
          <div className="mt-2 pt-2 border-t border-slate-200">
            <div className="text-xs text-slate-500">
              Range: {payload[2]?.value - payload[0]?.value}% spread
            </div>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  const CustomDot = (props: any) => {
    const { cx, cy, fill } = props;
    return (
      <motion.circle
        initial={{ r: 0 }}
        animate={{ r: 4 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        cx={cx}
        cy={cy}
        fill={fill}
        stroke="white"
        strokeWidth={2}
      />
    );
  };

  return (
    <div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="period" 
              stroke="#64748B"
              tick={{ fontSize: 12, fill: '#64748B' }}
              axisLine={{ stroke: '#CBD5E1' }}
            />
            <YAxis 
              stroke="#64748B"
              tick={{ fontSize: 12, fill: '#64748B' }}
              axisLine={{ stroke: '#CBD5E1' }}
              label={{ value: 'Return (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#64748B' } }}
            />
            <Tooltip content={renderTooltip} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line 
              type="monotone" 
              dataKey="Conservative" 
              stroke="#EF4444" 
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={<CustomDot />}
              activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2, fill: '#FEF2F2' }}
            />
            <Line 
              type="monotone" 
              dataKey="Expected" 
              stroke="#3B82F6" 
              strokeWidth={4}
              dot={<CustomDot />}
              activeDot={{ r: 7, stroke: '#3B82F6', strokeWidth: 2, fill: '#EFF6FF' }}
            />
            <Line 
              type="monotone" 
              dataKey="Optimistic" 
              stroke="#10B981" 
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={<CustomDot />}
              activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#F0FDF4' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">
            +{chartData[chartData.length - 1]?.Expected || 0}%
          </div>
          <div className="text-sm text-blue-700">10-Year Expected</div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="text-2xl font-bold text-green-600">
            +{chartData[chartData.length - 1]?.Optimistic || 0}%
          </div>
          <div className="text-sm text-green-700">Best Case Scenario</div>
        </div>
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
          <div className="text-2xl font-bold text-red-600">
            +{chartData[chartData.length - 1]?.Conservative || 0}%
          </div>
          <div className="text-sm text-red-700">Conservative Estimate</div>
        </div>
      </div>
    </div>
  );
}

export default GrowthProjectionChart;