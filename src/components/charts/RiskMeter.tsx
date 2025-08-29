import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Props {
  riskScore: number;
}

function RiskMeter({ riskScore }: Props) {
  const getRiskLevel = (score: number) => {
    if (score <= 3) return { 
      level: 'Low Risk', 
      color: '#10B981', 
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'Capital preservation focused with minimal volatility',
      icon: TrendingDown
    };
    if (score <= 6) return { 
      level: 'Moderate Risk', 
      color: '#F59E0B', 
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      description: 'Balanced growth with manageable volatility',
      icon: Minus
    };
    return { 
      level: 'High Risk', 
      color: '#EF4444', 
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      description: 'Maximum growth potential with higher volatility',
      icon: TrendingUp
    };
  };

  const riskInfo = getRiskLevel(riskScore);
  const IconComponent = riskInfo.icon;
  
  // Calculate position along the semicircle (0-180 degrees)
  const normalizedScore = Math.min(Math.max(riskScore, 0), 10);
  const angle = (normalizedScore / 10) * 180;
  const radian = (angle - 90) * (Math.PI / 180);
  const radius = 70;
  const needleX = 100 + radius * Math.cos(radian);
  const needleY = 90 + radius * Math.sin(radian);

  return (
    <div className="flex flex-col items-center">
      {/* SVG Gauge */}
      <div className="relative w-56 h-32 mb-6">
        <svg className="w-full h-full" viewBox="0 0 200 100" style={{ overflow: 'visible' }}>
          {/* Background arc */}
          <path
            d="M 20 80 A 80 80 0 0 1 180 80"
            stroke="#E2E8F0"
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Colored sections */}
          {/* Low risk (green) */}
          <path
            d="M 20 80 A 80 80 0 0 1 68 25"
            stroke="#10B981"
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
          />
          {/* Moderate risk (yellow) */}
          <path
            d="M 68 25 A 80 80 0 0 1 132 25"
            stroke="#F59E0B"
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
          />
          {/* High risk (red) */}
          <path
            d="M 132 25 A 80 80 0 0 1 180 80"
            stroke="#EF4444"
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Needle */}
          <motion.line
            x1="100"
            y1="90"
            x2={needleX}
            y2={needleY}
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ x2: 100, y2: 90 }}
            animate={{ x2: needleX, y2: needleY }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          />
          
          {/* Needle base */}
          <motion.circle
            cx="100"
            cy="90"
            r="6"
            fill="#1E293B"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          />
        </svg>
        
        {/* Risk level markers */}
        <div className="absolute bottom-2 left-0 text-xs font-medium text-green-600">
          Low
        </div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-medium text-yellow-600">
          Moderate
        </div>
        <div className="absolute bottom-2 right-0 text-xs font-medium text-red-600">
          High
        </div>
      </div>
      
      {/* Risk Score Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="text-center"
      >
        <div className={`text-5xl font-bold ${riskInfo.textColor} mb-2`}>
          {riskScore}
        </div>
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${riskInfo.bgColor}`}>
          <IconComponent className={`h-4 w-4 ${riskInfo.textColor}`} />
          <span className={`text-sm font-semibold ${riskInfo.textColor}`}>
            {riskInfo.level}
          </span>
        </div>
        <p className="text-slate-600 text-sm mt-3 max-w-xs">
          {riskInfo.description}
        </p>
      </motion.div>

      {/* Risk Breakdown */}
      <div className="mt-6 w-full max-w-sm">
        <div className="bg-slate-50 rounded-xl p-4">
          <h4 className="font-semibold text-slate-900 mb-3 text-center">Risk Breakdown</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Market Risk</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2, delay: 1.5 + (i * 0.1) }}
                    className={`w-2 h-4 rounded-sm ${
                      i <= Math.ceil(riskScore / 2) ? 'bg-blue-500' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Volatility</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2, delay: 1.8 + (i * 0.1) }}
                    className={`w-2 h-4 rounded-sm ${
                      i <= Math.ceil((riskScore + 1) / 2) ? 'bg-orange-500' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Liquidity</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2, delay: 2.1 + (i * 0.1) }}
                    className={`w-2 h-4 rounded-sm ${
                      i <= Math.max(1, 6 - Math.ceil(riskScore / 2)) ? 'bg-green-500' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiskMeter;