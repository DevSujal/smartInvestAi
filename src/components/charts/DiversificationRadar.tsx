import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface Props {
  portfolio: { [key: string]: number };
  diversificationScore: number;
}

function DiversificationRadar({ portfolio, diversificationScore }: Props) {
  const assetTypes = ['stocks', 'bonds', 'etfs', 'crypto', 'reits', 'commodities'];
  
  const chartData = assetTypes.map(asset => ({
    asset: asset.charAt(0).toUpperCase() + asset.slice(1),
    value: portfolio[asset] || 0,
    fullMark: 100,
  }));

  const getDiversificationLevel = (score: number) => {
    if (score >= 8) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 6) return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 4) return { level: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { level: 'Poor', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const divInfo = getDiversificationLevel(diversificationScore);

  const CustomTick = ({ payload, x, y, textAnchor }: any) => {
    return (
      <text
        x={x}
        y={y}
        textAnchor={textAnchor}
        fill="#64748B"
        fontSize="12"
        fontWeight="500"
      >
        {payload.value}
      </text>
    );
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4"
      >
        <div className={`text-3xl font-bold ${divInfo.color} mb-1`}>
          {diversificationScore}/10
        </div>
        <div className={`inline-block px-3 py-1 rounded-full ${divInfo.bgColor}`}>
          <span className={`text-sm font-semibold ${divInfo.color}`}>
            {divInfo.level} Diversification
          </span>
        </div>
      </motion.div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis 
              dataKey="asset" 
              tick={<CustomTick />}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fontSize: 10, fill: '#94A3B8' }}
              tickCount={6}
            />
            <Radar
              name="Portfolio Allocation"
              dataKey="value"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.2}
              strokeWidth={2}
              dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Asset Class Breakdown */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-slate-900 mb-3">Asset Distribution</h4>
        <div className="grid grid-cols-2 gap-2">
          {chartData
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value)
            .map((item, index) => (
              <motion.div
                key={item.asset}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-2 bg-slate-50 rounded-lg"
              >
                <span className="text-xs font-medium text-slate-700">{item.asset}</span>
                <span className="text-xs font-bold text-slate-900">{item.value}%</span>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Diversification Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Diversification Analysis</h4>
        <div className="text-xs text-blue-800 space-y-1">
          {diversificationScore >= 8 && (
            <p>✅ Excellent asset spread reduces overall portfolio risk</p>
          )}
          {diversificationScore >= 6 && diversificationScore < 8 && (
            <p>✅ Good diversification with room for minor improvements</p>
          )}
          {diversificationScore >= 4 && diversificationScore < 6 && (
            <p>⚠️ Consider adding more asset classes to reduce correlation risk</p>
          )}
          {diversificationScore < 4 && (
            <p>⚠️ Portfolio is concentrated - consider broader diversification</p>
          )}
          <p>💡 Diversification helps smooth returns over different market cycles</p>
        </div>
      </div>
    </div>
  );
}

export default DiversificationRadar;