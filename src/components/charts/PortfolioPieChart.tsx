import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface Props {
  data: { [key: string]: number };
}

function PortfolioPieChart({ data }: Props) {
  const colors = {
    stocks: '#3B82F6',
    bonds: '#10B981',
    etfs: '#8B5CF6',
    crypto: '#F59E0B',
    reits: '#14B8A6',
    commodities: '#EF4444',
  };

  const assetNames = {
    stocks: 'Stocks',
    bonds: 'Bonds',
    etfs: 'ETFs',
    crypto: 'Crypto',
    reits: 'REITs',
    commodities: 'Commodities',
  };

  const chartData = Object.entries(data)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name: assetNames[name as keyof typeof assetNames] || name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: colors[name as keyof typeof colors] || '#6B7280',
      percentage: value,
    }))
    .sort((a, b) => b.value - a.value);

  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-4 shadow-xl rounded-xl border border-slate-200"
        >
          <p className="font-semibold text-slate-900">{data.name}</p>
          <p className="text-blue-600 font-medium">{data.value}% of portfolio</p>
          <p className="text-slate-500 text-sm">Recommended allocation</p>
        </motion.div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for slices < 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              innerRadius={40}
              dataKey="value"
              animationBegin={0}
              animationDuration={1000}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={renderTooltip} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Asset Breakdown */}
      <div className="mt-6 space-y-3">
        {chartData.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium text-slate-900">{item.name}</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-900">{item.value}%</div>
              <div className="text-xs text-slate-500">allocation</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default PortfolioPieChart;