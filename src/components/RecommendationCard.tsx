import { motion } from 'framer-motion';
import { TrendingUp, Shield, DollarSign, BarChart3, Clock, AlertTriangle, CheckCircle, Target, Zap, Sparkles, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Portfolio {
  stocks: number;
  bonds: number;
  etfs: number;
  crypto?: number;
  reits?: number;
  commodities?: number;
}

interface Projections {
  [key: string]: {
    conservative: number;
    expected: number;
    optimistic: number;
  };
}

interface RiskAssessment {
  marketVolatility: string;
  liquidityRisk: string;
  inflationProtection: string;
}

interface Recommendation {
  portfolio: Portfolio;
  rationale: { [key: string]: string };
  riskScore: number;
  diversificationScore: number;
  projections: Projections;
  riskAssessment: RiskAssessment;
  timestamp: string;
  userInput: string;
  isAI: boolean;
}

interface Props {
  recommendation: Recommendation;
}

function RecommendationCard({ recommendation }: Props) {
  const { theme } = useTheme();
  const { portfolio, rationale, riskScore, diversificationScore, projections, riskAssessment, isAI } = recommendation;

  // Helper function to safely access portfolio properties
  const getPortfolioValue = (asset: string): number => {
    return (portfolio as any)[asset] || 0;
  };

  const assetColors: { [key: string]: string } = {
    stocks: theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500',
    bonds: theme === 'dark' ? 'bg-green-400' : 'bg-green-500',
    etfs: theme === 'dark' ? 'bg-purple-400' : 'bg-purple-500',
    crypto: theme === 'dark' ? 'bg-orange-400' : 'bg-orange-500',
    reits: theme === 'dark' ? 'bg-teal-400' : 'bg-teal-500',
    commodities: theme === 'dark' ? 'bg-red-400' : 'bg-red-500',
  };

  const assetNames: { [key: string]: string } = {
    stocks: 'Stocks',
    bonds: 'Bonds',
    etfs: 'ETFs',
    crypto: 'Cryptocurrency',
    reits: 'REITs',
    commodities: 'Commodities',
  };

  const getRiskColor = (score: number) => {
    if (score <= 3) return theme === 'dark' ? 'text-green-400' : 'text-green-600';
    if (score <= 6) return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600';
    return theme === 'dark' ? 'text-red-400' : 'text-red-600';
  };

  const getRiskBadge = (score: number) => {
    if (score <= 3) return {
      text: 'Conservative',
      bg: theme === 'dark' ? 'bg-green-900/50' : 'bg-green-100',
      color: theme === 'dark' ? 'text-green-300' : 'text-green-700'
    };
    if (score <= 6) return {
      text: 'Balanced',
      bg: theme === 'dark' ? 'bg-yellow-900/50' : 'bg-yellow-100',
      color: theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'
    };
    return {
      text: 'Aggressive',
      bg: theme === 'dark' ? 'bg-red-900/50' : 'bg-red-100',
      color: theme === 'dark' ? 'text-red-300' : 'text-red-700'
    };
  };

  const riskBadge = getRiskBadge(riskScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.01, y: -2 }}
      className={`${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800'
          : 'bg-gradient-to-br from-white via-slate-50 to-blue-50'
      } rounded-2xl p-6 shadow-xl border ${
        theme === 'dark' ? 'border-slate-600' : 'border-slate-200'
      } relative overflow-hidden backdrop-blur-sm`}
    >
      {/* Animated Background Elements */}
      <div className={`absolute inset-0 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10'
          : 'bg-gradient-to-br from-blue-500/5 to-purple-500/5'
      } rounded-2xl`} />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
      />
      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-xl"
      />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <motion.div
            initial={{ rotate: 0, scale: 0.8 }}
            animate={{ rotate: 360, scale: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
            className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg"
          >
            <TrendingUp className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h3 className={`text-xl font-bold flex items-center space-x-2 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              <span>Portfolio Recommendation</span>
              {isAI && (
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Zap className="h-4 w-4 text-yellow-500" />
                </motion.div>
              )}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
              >
                <Heart className="h-4 w-4 text-pink-500" />
              </motion.div>
            </h3>
            <p className={`text-sm flex items-center space-x-2 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <span>{isAI ? 'AI-Powered Analysis' : 'Expert Analysis'}</span>
              <span>•</span>
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Just generated
              </motion.span>
              <Sparkles className="h-3 w-3 text-yellow-500" />
            </p>
          </div>
        </div>
        <div className="flex space-x-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center"
          >
            <div className={`text-2xl font-bold ${getRiskColor(riskScore)}`}>{riskScore}/10</div>
            <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Risk</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center"
          >
            <div className="text-2xl font-bold text-blue-600">{diversificationScore}/10</div>
            <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Diversity</div>
          </motion.div>
        </div>
      </div>

      {/* Strategy Badge */}
      <div className="relative mb-6">
        <motion.span
          whileHover={{ scale: 1.05 }}
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold border ${
            riskBadge.bg
          } ${riskBadge.color} ${
            theme === 'dark' ? 'border-slate-600' : 'border-slate-300'
          }`}
        >
          <Target className="h-4 w-4" />
          <span>{riskBadge.text} Strategy</span>
        </motion.span>
      </div>

      {/* Portfolio Allocation */}
      <div className="relative mb-6">
        <h4 className={`text-lg font-semibold mb-4 flex items-center ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
          Asset Allocation
        </h4>
        <div className="space-y-3">
          {Object.entries(portfolio)
            .filter(([_, value]) => value > 0)
            .sort(([, a], [, b]) => b - a)
            .map(([asset, percentage], index) => (
              <motion.div
                key={asset}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)'
                }}
                className="flex items-center group rounded-lg p-2 transition-all duration-300"
              >
                <div className={`w-28 text-sm font-medium capitalize flex items-center space-x-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className={`w-3 h-3 rounded-full ${assetColors[asset] || 'bg-gray-500'} shadow-sm`}
                  />
                  <span>{assetNames[asset] || asset}</span>
                </div>
                <div className="flex-1 mx-4">
                  <div className={`${
                    theme === 'dark' ? 'bg-slate-600' : 'bg-slate-200'
                  } rounded-full h-2.5 shadow-inner`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1.2, delay: 0.8 + index * 0.1, ease: "easeOut" }}
                      className={`h-2.5 rounded-full ${assetColors[asset] || 'bg-gray-500'} shadow-sm`}
                    />
                  </div>
                </div>
                <div className={`w-16 text-sm font-bold text-right ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  {percentage}%
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Key Projections */}
      <div className="relative mb-6">
        <h4 className={`text-lg font-semibold mb-4 flex items-center ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          <Clock className="h-5 w-5 mr-2 text-green-600" />
          Growth Projections
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(projections).map(([period, values], index) => (
            <motion.div
              key={period}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
              whileHover={{
                scale: 1.05,
                boxShadow: theme === 'dark'
                  ? '0 8px 25px rgba(0,0,0,0.3)'
                  : '0 8px 25px rgba(0,0,0,0.1)'
              }}
              className={`${
                theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'
              } p-4 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 group`}
            >
              <div className={`text-sm font-semibold mb-3 ${
                theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
              }`}>{period.replace('year', ' Year')}</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-green-600 font-medium">Best</span>
                  <span className="font-bold text-green-600">+{values.optimistic}%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-blue-600 font-medium">Expected</span>
                  <span className="font-bold text-blue-600">+{values.expected}%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-red-600 font-medium">Conservative</span>
                  <span className="font-bold text-red-600">+{values.conservative}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="relative mb-6">
        <h4 className={`text-lg font-semibold mb-4 flex items-center ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          <Shield className="h-5 w-5 mr-2 text-orange-600" />
          Risk Analysis
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            whileHover={{
              scale: 1.02,
              boxShadow: theme === 'dark'
                ? '0 8px 25px rgba(0,0,0,0.3)'
                : '0 8px 25px rgba(0,0,0,0.1)'
            }}
            className={`${
              theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'
            } p-4 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 group`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-orange-900/50 group-hover:bg-orange-800/50'
                  : 'bg-orange-100 group-hover:bg-orange-200'
              }`}>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <div className={`text-sm font-semibold mb-1 ${
                  theme === 'dark' ? 'text-slate-200' : 'text-slate-900'
                }`}>Market Volatility</div>
                <div className={`text-xs leading-relaxed ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>{riskAssessment.marketVolatility}</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 1.0 }}
            whileHover={{
              scale: 1.02,
              boxShadow: theme === 'dark'
                ? '0 8px 25px rgba(0,0,0,0.3)'
                : '0 8px 25px rgba(0,0,0,0.1)'
            }}
            className={`${
              theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'
            } p-4 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 group`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-blue-900/50 group-hover:bg-blue-800/50'
                  : 'bg-blue-100 group-hover:bg-blue-200'
              }`}>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className={`text-sm font-semibold mb-1 ${
                  theme === 'dark' ? 'text-slate-200' : 'text-slate-900'
                }`}>Liquidity Risk</div>
                <div className={`text-xs leading-relaxed ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>{riskAssessment.liquidityRisk}</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 1.1 }}
            whileHover={{
              scale: 1.02,
              boxShadow: theme === 'dark'
                ? '0 8px 25px rgba(0,0,0,0.3)'
                : '0 8px 25px rgba(0,0,0,0.1)'
            }}
            className={`${
              theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'
            } p-4 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 group`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-green-900/50 group-hover:bg-green-800/50'
                  : 'bg-green-100 group-hover:bg-green-200'
              }`}>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <div className={`text-sm font-semibold mb-1 ${
                  theme === 'dark' ? 'text-slate-200' : 'text-slate-900'
                }`}>Inflation Protection</div>
                <div className={`text-xs leading-relaxed ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>{riskAssessment.inflationProtection}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Investment Rationale Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        whileHover={{ scale: 1.01 }}
        className={`relative p-5 rounded-xl border ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-blue-700'
            : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
        }`}
      >
        <div className="flex items-center space-x-2 mb-3">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
          >
            <CheckCircle className="h-5 w-5 text-blue-600" />
          </motion.div>
          <h4 className={`text-sm font-bold ${
            theme === 'dark' ? 'text-blue-300' : 'text-blue-900'
          }`}>Investment Strategy Summary</h4>
        </div>
        <div className="space-y-2">
          {Object.entries(rationale)
            .filter(([asset]) => getPortfolioValue(asset) > 0)
            .slice(0, 2) // Show top 2 rationales to keep it concise
            .map(([asset, reason], index) => (
              <motion.div
                key={asset}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.3 + index * 0.1 }}
                className={`text-xs leading-relaxed ${
                  theme === 'dark' ? 'text-blue-200' : 'text-blue-800'
                }`}
              >
                <span className="font-semibold capitalize">{assetNames[asset] || asset} ({getPortfolioValue(asset)}%):</span> {reason}
              </motion.div>
            ))}
          {Object.keys(rationale).filter(asset => getPortfolioValue(asset) > 0).length > 2 && (
            <div className={`text-xs italic mt-2 ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
            }`}>
              + {Object.keys(rationale).filter(asset => getPortfolioValue(asset) > 0).length - 2} more asset explanations available in dashboard
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default RecommendationCard;