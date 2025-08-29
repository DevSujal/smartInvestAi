import React from 'react';
import { useRecommendation } from '../context/RecommendationContext';
import { Link } from 'react-router-dom';
import { MessageCircle, Download, TrendingUp, BarChart3, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import PortfolioPieChart from './charts/PortfolioPieChart';
import GrowthProjectionChart from './charts/GrowthProjectionChart';
import RiskMeter from './charts/RiskMeter';
import DiversificationRadar from './charts/DiversificationRadar';
import Toast from './Toast';

function Dashboard() {
  const { currentRecommendation } = useRecommendation();
  const [showShareSuccess, setShowShareSuccess] = React.useState(false);
  const [showExportSuccess, setShowExportSuccess] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [showToast, setShowToast] = React.useState(false);

  // Export report functionality
  const handleExportReport = async () => {
    if (!currentRecommendation) return;

    setIsExporting(true);

    try {
      // Create a comprehensive report content
      const reportContent = generateReportContent(currentRecommendation);

      // Create and download the report
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `investment-portfolio-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Also offer JSON export
      setTimeout(() => {
        const jsonBlob = new Blob([JSON.stringify(currentRecommendation, null, 2)], { type: 'application/json' });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const jsonLink = document.createElement('a');
        jsonLink.href = jsonUrl;
        jsonLink.download = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(jsonLink);
        jsonLink.click();
        document.body.removeChild(jsonLink);
        URL.revokeObjectURL(jsonUrl);
      }, 500);

      // Show success notification
      setShowExportSuccess(true);
      setToastMessage('Portfolio report exported successfully!');
      setShowToast(true);
      setTimeout(() => setShowExportSuccess(false), 3000);
    } catch (error) {
      console.error('Error exporting report:', error);
      setToastMessage('Failed to export report. Please try again.');
      setShowToast(true);
    } finally {
      setIsExporting(false);
    }
  };

  // Share portfolio functionality
  const handleSharePortfolio = async () => {
    if (!currentRecommendation) return;

    const shareData = {
      title: 'My Investment Portfolio Analysis',
      text: generateShareText(currentRecommendation),
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.text + '\n\n' + shareData.url);
        setShowShareSuccess(true);
        setToastMessage('Portfolio details copied to clipboard!');
        setShowToast(true);
        setTimeout(() => setShowShareSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error sharing portfolio:', error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.text + '\n\n' + shareData.url);
        setShowShareSuccess(true);
        setToastMessage('Portfolio details copied to clipboard!');
        setShowToast(true);
        setTimeout(() => setShowShareSuccess(false), 3000);
      } catch (clipboardError) {
        console.error('Error copying to clipboard:', clipboardError);
        setToastMessage('Failed to share portfolio. Please try again.');
        setShowToast(true);
      }
    }
  };

  // Helper function to generate report content
  const generateReportContent = (recommendation: any) => {
    const date = new Date().toLocaleDateString();
    const portfolioEntries = Object.entries(recommendation.portfolio) as [string, number][];
    const totalAssets = portfolioEntries.filter(([, percentage]) => percentage > 0).length;

    return `
╔══════════════════════════════════════════════════════════════════╗
║                   INVESTMENT PORTFOLIO ANALYSIS REPORT          ║
║                     Generated on: ${date}                    ║
╚══════════════════════════════════════════════════════════════════╝

📊 EXECUTIVE SUMMARY
═══════════════════
• Risk Score: ${recommendation.riskScore}/10 (${getRiskLevel(recommendation.riskScore)})
• Diversification Score: ${recommendation.diversificationScore}%
• Total Asset Classes: ${totalAssets}
• Analysis Type: ${recommendation.isAI ? 'AI-Powered' : 'Expert'} Recommendation

📈 PORTFOLIO ALLOCATION
═══════════════════════
${portfolioEntries
        .filter(([, percentage]) => percentage > 0)
        .sort(([, a], [, b]) => b - a)
        .map(([asset, percentage]) => {
          const bars = '█'.repeat(Math.round(percentage / 5));
          return `${asset.toUpperCase().padEnd(12)} ${String(percentage).padStart(3)}% ${bars}`;
        })
        .join('\n')}

⚠️  RISK ASSESSMENT
══════════════════
Market Volatility:     ${recommendation.riskAssessment.marketVolatility}
Liquidity Risk:        ${recommendation.riskAssessment.liquidityRisk}
Inflation Protection:  ${recommendation.riskAssessment.inflationProtection}

💰 RETURN PROJECTIONS
═════════════════════
${Object.entries(recommendation.projections)
        .map(([period, proj]: [string, any]) => {
          const periodLabel = period.replace('year', ' Year').padEnd(10);
          return `${periodLabel} Conservative: ${proj.conservative}%  Expected: ${proj.expected}%  Optimistic: ${proj.optimistic}%`;
        })
        .join('\n')}

💡 INVESTMENT RATIONALE
══════════════════════
${Object.entries(recommendation.rationale)
        .map(([asset, reason]) => `${asset.toUpperCase()}:\n  ${reason}\n`)
        .join('\n')}

🎯 INVESTMENT GOALS
══════════════════
"${recommendation.userInput}"

📋 PORTFOLIO METRICS
═══════════════════
• Diversification Quality: ${getDiversificationQuality(recommendation.diversificationScore)}
• Risk-Return Profile: ${getRiskReturnProfile(recommendation.riskScore, recommendation.projections['5year']?.expected)}
• Recommended Review Period: ${getReviewPeriod(recommendation.riskScore)} months

═══════════════════════════════════════════════════════════════════
Generated: ${new Date(recommendation.timestamp).toLocaleString()}
Powered by AI Investment Advisor Platform
═══════════════════════════════════════════════════════════════════

DISCLAIMER: This analysis is for informational purposes only and should 
not be considered as financial advice. Please consult with a qualified 
financial advisor before making investment decisions.
`;
  };

  // Helper functions for report enhancement
  const getRiskLevel = (score: number) => {
    if (score <= 3) return 'Conservative';
    if (score <= 6) return 'Moderate';
    if (score <= 8) return 'Aggressive';
    return 'Very Aggressive';
  };

  const getDiversificationQuality = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  const getRiskReturnProfile = (risk: number, expectedReturn: number) => {
    if (risk <= 4 && expectedReturn <= 6) return 'Conservative Growth';
    if (risk <= 6 && expectedReturn <= 9) return 'Balanced Growth';
    if (risk <= 8 && expectedReturn <= 12) return 'Growth Focused';
    return 'Aggressive Growth';
  };

  const getReviewPeriod = (risk: number) => {
    if (risk <= 3) return '12';
    if (risk <= 6) return '6';
    return '3';
  };

  // Helper function to convert portfolio to chart format
  const portfolioToChartData = (portfolio: any) => {
    const result: { [key: string]: number } = {};
    Object.entries(portfolio).forEach(([key, value]) => {
      result[key] = value as number;
    });
    return result;
  };

  const closeToast = () => {
    setShowToast(false);
    setToastMessage('');
  };

  // Helper function to generate share text
  const generateShareText = (recommendation: any) => {
    const topAllocations = Object.entries(recommendation.portfolio)
      .filter(([, percentage]) => (percentage as number) > 0)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([asset, percentage]) => `${asset}: ${percentage}%`)
      .join(', ');

    const expectedReturn = recommendation.projections['5year']?.expected || 'N/A';
    const riskLevel = getRiskLevel(recommendation.riskScore);

    return `🎯 My AI-Generated Investment Portfolio Analysis

📊 Asset Allocation: ${topAllocations}
⚖️  Risk Profile: ${riskLevel} (${recommendation.riskScore}/10)
📈 Expected 5-Year Return: ${expectedReturn}%
🎯 Diversification Score: ${recommendation.diversificationScore}%

� Key Insights:
• ${Object.keys(recommendation.portfolio).filter(k => (recommendation.portfolio as any)[k] > 0).length} asset classes for optimal diversification
• ${recommendation.riskAssessment.marketVolatility} market volatility exposure
• ${recommendation.riskAssessment.inflationProtection} inflation protection

🤖 Generated with AI Investment Advisor`;
  };

  if (!currentRecommendation) {
    return (
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-8xl mb-6"
            >
              📊
            </motion.div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready for Your Investment Analysis</h2>
            <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
              Get started by chatting with our AI advisor to receive personalized portfolio recommendations
              tailored to your financial goals, risk tolerance, and investment timeline.
            </p>
            <Link
              to="/advisor"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-semibold">Start Investment Analysis</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const assetCount = Object.entries(currentRecommendation.portfolio).filter(
    ([, value]) => (value as number) > 0
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Investment Dashboard</h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-slate-600 space-y-1 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${currentRecommendation.isAI ? 'bg-green-500' : 'bg-blue-500'}`} />
                <span className="text-sm sm:text-base">{currentRecommendation.isAI ? 'AI-Generated Analysis' : 'Expert Analysis'}</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <span className="text-sm sm:text-base">{new Date(currentRecommendation.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleExportReport}
              disabled={isExporting}
              className="flex items-center justify-center space-x-2 bg-white text-slate-700 px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-slate-300 hover:bg-slate-50 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {showExportSuccess ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-600">Exported!</span>
                </>
              ) : (
                <>
                  <Download className={`h-4 w-4 ${isExporting ? 'animate-bounce' : ''}`} />
                  <span className="font-medium">
                    {isExporting ? 'Exporting...' : 'Export Report'}
                  </span>
                </>
              )}
            </button>
            {/* <button
              onClick={handleSharePortfolio}
              className="relative flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {showShareSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  <span className="font-medium">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  <span className="font-medium">Share Portfolio</span>
                </>
              )}
            </button> */}
          </div>
        </div>
      </motion.div>      {/* Summary Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6 sm:mb-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
      >
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 opacity-80" />
            <div className="text-xl sm:text-3xl font-bold">{currentRecommendation.riskScore}/10</div>
          </div>
          <div className="text-blue-100 font-medium text-xs sm:text-base">Risk Score</div>
          <div className="text-blue-200 text-xs sm:text-sm mt-0.5 sm:mt-1 hidden sm:block">Portfolio volatility level</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6 opacity-80" />
            <div className="text-xl sm:text-3xl font-bold">{currentRecommendation.diversificationScore}/10</div>
          </div>
          <div className="text-green-100 font-medium text-xs sm:text-base">Diversification</div>
          <div className="text-green-200 text-xs sm:text-sm mt-0.5 sm:mt-1 hidden sm:block">Asset spread quality</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 opacity-80" />
            <div className="text-xl sm:text-3xl font-bold">
              +{currentRecommendation.projections['5year']?.expected || 'N/A'}%
            </div>
          </div>
          <div className="text-purple-100 font-medium text-xs sm:text-base">5-Year Expected</div>
          <div className="text-purple-200 text-xs sm:text-sm mt-0.5 sm:mt-1 hidden sm:block">Projected returns</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6 opacity-80" />
            <div className="text-xl sm:text-3xl font-bold">{assetCount}</div>
          </div>
          <div className="text-orange-100 font-medium text-xs sm:text-base">Asset Classes</div>
          <div className="text-orange-200 text-xs sm:text-sm mt-0.5 sm:mt-1 hidden sm:block">Portfolio diversity</div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Portfolio Allocation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-slate-100 hover:shadow-2xl transition-shadow"
        >
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg sm:rounded-xl">
              <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Portfolio Allocation</h2>
              <p className="text-slate-500 text-xs sm:text-sm">Recommended asset distribution</p>
            </div>
          </div>
          <PortfolioPieChart data={portfolioToChartData(currentRecommendation.portfolio)} />
        </motion.div>

        {/* Growth Projections */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-slate-100 hover:shadow-2xl transition-shadow"
        >
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg sm:rounded-xl">
              <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Growth Projections</h2>
              <p className="text-slate-500 text-xs sm:text-sm">Expected return scenarios over time</p>
            </div>
          </div>
          <GrowthProjectionChart data={currentRecommendation.projections} />
        </motion.div>

        {/* Risk Assessment */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-slate-100 hover:shadow-2xl transition-shadow"
        >
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg sm:rounded-xl">
              <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Risk Assessment</h2>
              <p className="text-slate-500 text-xs sm:text-sm">Risk tolerance and volatility metrics</p>
            </div>
          </div>
          <RiskMeter riskScore={currentRecommendation.riskScore} />
        </motion.div>

        {/* Diversification Analysis */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-slate-100 hover:shadow-2xl transition-shadow"
        >
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg sm:rounded-xl">
              <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Diversification Analysis</h2>
              <p className="text-slate-500 text-xs sm:text-sm">Asset correlation and balance assessment</p>
            </div>
          </div>
          <DiversificationRadar
            portfolio={portfolioToChartData(currentRecommendation.portfolio)}
            diversificationScore={currentRecommendation.diversificationScore}
          />
        </motion.div>
      </div>

      {/* Investment Rationale */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-6 sm:mt-8 bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-slate-100"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Investment Strategy & Rationale</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Asset Rationale */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">Asset Allocation Reasoning</h3>
            <div className="space-y-3 sm:space-y-4">
              {Object.entries(currentRecommendation.rationale)
                .filter(([asset]) => {
                  const portfolio = currentRecommendation.portfolio as any;
                  return portfolio[asset] > 0;
                })
                .map(([asset, reason], index) => {
                  const portfolio = currentRecommendation.portfolio as any;
                  return (
                    <motion.div
                      key={asset}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                      className="p-3 sm:p-4 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-200"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                        <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${asset === 'stocks' ? 'bg-blue-500' :
                            asset === 'bonds' ? 'bg-green-500' :
                              asset === 'etfs' ? 'bg-purple-500' :
                                asset === 'crypto' ? 'bg-orange-500' :
                                  asset === 'reits' ? 'bg-teal-500' :
                                    'bg-red-500'
                          }`} />
                        <span className="font-semibold text-slate-900 capitalize text-sm sm:text-base">
                          {asset} ({portfolio[asset]}%)
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{reason}</p>
                    </motion.div>
                  );
                })}
            </div>
          </div>

          {/* Risk Analysis */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">Risk Analysis</h3>
            <div className="space-y-3 sm:space-y-4">
              {Object.entries(currentRecommendation.riskAssessment).map(([category, analysis], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  className="p-3 sm:p-4 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-200"
                >
                  <div className="font-semibold text-slate-900 mb-2 capitalize text-sm sm:text-base">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{analysis}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* User Input Context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-6 sm:mt-8 p-4 sm:p-6 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200"
        >
          <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">Your Investment Goals</h3>
          <p className="text-blue-800 italic text-sm sm:text-base">"{currentRecommendation.userInput}"</p>
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-blue-700 space-y-1 sm:space-y-0">
            <span>Analysis Date: {new Date(currentRecommendation.timestamp).toLocaleDateString()}</span>
            <span className="hidden sm:inline">•</span>
            <span>{currentRecommendation.isAI ? 'AI-Powered' : 'Expert'} Recommendation</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Toast Notification */}
      <Toast
        show={showToast}
        type={toastMessage.includes('Failed') ? 'error' : 'success'}
        message={toastMessage}
        onClose={closeToast}
      />
    </motion.div>
  );
}

export default Dashboard;