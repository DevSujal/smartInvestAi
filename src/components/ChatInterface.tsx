import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Zap, AlertCircle, Heart, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecommendation } from '../context/RecommendationContext';
import { useTheme } from '../context/ThemeContext';
import RecommendationCard from './RecommendationCard';
import TypingIndicator from './TypingIndicator';
import { getInvestmentRecommendation } from '../services/api';

const suggestedQueries = [
  "I'm 25, want aggressive growth for retirement in 40 years",
  "I need low-risk investments with steady income for retirement",
  "I have $50K for 10 years, moderate risk tolerance",
  "Help me invest $10K for my child's college in 15 years"
];

function ChatInterface() {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, addMessage, setCurrentRecommendation, isLoading, setIsLoading } = useRecommendation();
  const { theme } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSuggestedQuery = (query: string) => {
    setInputText(query);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText('');
    setError(null);

    // Add user message
    addMessage({ text: userMessage, isUser: true });

    // Show typing indicator
    setIsTyping(true);
    setIsLoading(true);

    try {
      // Get AI recommendation
      const recommendation = await getInvestmentRecommendation(userMessage);

      // Hide typing indicator
      setIsTyping(false);

      // Add AI response with recommendation
      const responseText = recommendation.isAI
        ? "I've analyzed your investment goals using advanced AI and created a comprehensive, personalized portfolio recommendation tailored specifically for your situation."
        : "Based on your investment profile, I've created a personalized portfolio recommendation using our expert financial analysis framework.";

      addMessage({
        text: responseText,
        isUser: false,
        recommendation
      });

      setCurrentRecommendation(recommendation);

    } catch (error) {
      setIsTyping(false);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      addMessage({
        text: "I apologize, but I'm experiencing technical difficulties processing your request. This might be due to server connectivity issues. Please try again in a moment, or try one of the suggested queries below.",
        isUser: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 backdrop-blur-sm"
      >
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 dark:from-blue-700 dark:via-blue-800 dark:to-blue-900 p-4 sm:p-6 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 animate-bounce"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12 animate-bounce" style={{ animationDelay: '1s' }}></div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between relative z-10">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-0">
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="p-2 sm:p-3 bg-white/20 dark:bg-white/10 rounded-xl backdrop-blur-sm shadow-lg"
              >
                <Bot className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
                  <span>AI Investment Advisor</span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-pink-300" />
                  </motion.div>
                </h2>
                <p className="text-sm sm:text-base text-blue-100 dark:text-blue-200 flex items-center space-x-2">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Powered by advanced AI • Real-time analysis</span>
                  <span className="sm:hidden">AI-Powered Analysis</span>
                </p>
              </div>
            </div>
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
              className="p-2"
            >
              <Sparkles className="h-6 w-6 text-yellow-300" />
            </motion.div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="h-[500px] overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white dark:from-slate-800 dark:to-slate-900">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 sm:space-x-3 max-w-xs sm:max-w-md lg:max-w-4xl ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <motion.div
                    whileHover={{
                      scale: 1.1,
                      rotate: message.isUser ? -10 : 10
                    }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 sm:p-2.5 rounded-full shadow-md ${
                      message.isUser
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600'
                        : 'bg-gradient-to-r from-slate-700 to-slate-800 dark:from-slate-600 dark:to-slate-700'
                    }`}
                  >
                    {message.isUser ? <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" /> : <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />}
                  </motion.div>
                  <div className="flex-1">
                    <motion.div
                      whileHover={{
                        scale: 1.01,
                        boxShadow: theme === 'dark'
                          ? '0 10px 25px rgba(0,0,0,0.3)'
                          : '0 10px 25px rgba(0,0,0,0.1)'
                      }}
                      className={`p-3 sm:p-4 rounded-2xl shadow-sm border ${
                        message.isUser
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white rounded-tr-md border-blue-700 dark:border-blue-500'
                          : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-md border-slate-200 dark:border-slate-600 shadow-md dark:shadow-lg'
                      }`}
                    >
                      <p className="text-sm sm:text-base leading-relaxed">{message.text}</p>
                      <div className={`text-xs mt-2 flex items-center space-x-2 ${
                        message.isUser ? 'text-blue-200' : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {!message.isUser && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Star className="h-3 w-3 text-yellow-400" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                    {message.recommendation && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          duration: 0.5,
                          delay: 0.3,
                          type: "spring",
                          stiffness: 120
                        }}
                        className="mt-4"
                      >
                        <RecommendationCard recommendation={message.recommendation} />
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 sm:px-6 pb-4"
          >
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 sm:p-4 flex items-start space-x-2 sm:space-x-3">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-red-800 dark:text-red-400 text-sm sm:text-base">Connection Issue</h4>
                <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 mt-1 break-words">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Suggested Queries (show only when no messages besides initial) */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="px-4 sm:px-6 pb-4"
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 sm:p-4 border border-blue-200 dark:border-blue-800">
              <h3 className="text-xs sm:text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2 sm:mb-3">Try these examples:</h3>
              <div className="grid grid-cols-1 gap-2">
                {suggestedQueries.map((query, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.5 + index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: theme === 'dark'
                        ? '0 4px 12px rgba(0,0,0,0.3)'
                        : '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSuggestedQuery(query)}
                    className="text-left p-2 sm:p-3 bg-white dark:bg-slate-700 rounded-lg border border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300 text-xs sm:text-sm text-blue-800 dark:text-blue-300 shadow-sm hover:shadow-md"
                  >
                    "{query}"
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Input Form */}
        <div className="p-4 sm:p-6 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          <form onSubmit={handleSubmit} className="flex space-x-2 sm:space-x-3">
            <div className="flex-1">
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Describe your investment goals..."
                className="w-full p-3 sm:p-4 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                disabled={isLoading}
              />
            </div>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: theme === 'dark'
                  ? '0 8px 25px rgba(0,0,0,0.3)'
                  : '0 8px 25px rgba(59, 130, 246, 0.3)'
              }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-3 sm:p-4 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.button>
          </form>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-2">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
              >
                💡
              </motion.span>
              <span className="hidden sm:inline">Include your age, risk tolerance, investment timeline, and goals for best results</span>
              <span className="sm:hidden">Include age, risk tolerance & timeline</span>
            </p>
            {messages.length > 1 && (
              <button
                onClick={() => setError(null)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors self-start sm:self-auto"
              >
                Clear errors
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ChatInterface;