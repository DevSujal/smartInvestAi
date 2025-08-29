import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, Brain } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function TypingIndicator() {
  const { theme } = useTheme();

  const messages = [
    "AI is analyzing your investment goals",
    "Processing market data and risk factors",
    "Generating personalized recommendations",
    "Finalizing your investment strategy"
  ];

  const [currentMessage, setCurrentMessage] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
      className="flex justify-start"
    >
      <div className="flex items-start space-x-3 max-w-3xl">
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1
          }}
          className={`p-2.5 rounded-full shadow-md ${
            theme === 'dark' ? 'bg-slate-600' : 'bg-slate-700'
          }`}
        >
          <Bot className="h-4 w-4 text-white" />
        </motion.div>
        <div className={`p-4 rounded-2xl rounded-tl-sm shadow-sm border ${
          theme === 'dark'
            ? 'bg-slate-700 border-slate-600 text-slate-200'
            : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="h-4 w-4 text-blue-500" />
            </motion.div>
            <motion.span
              key={currentMessage}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="text-sm"
            >
              {messages[currentMessage]}
            </motion.span>
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                    y: [0, -5, 0]
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                  className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"
                />
              ))}
            </div>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="h-4 w-4 text-yellow-500" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default TypingIndicator;