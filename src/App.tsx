import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import { RecommendationProvider } from './context/RecommendationContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <RecommendationProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
              <Routes>
                <Route path="/" element={<Navigate to="/advisor" replace />} />
                <Route path="/advisor" element={<ChatInterface />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </main>
          </div>
        </Router>
      </RecommendationProvider>
    </ThemeProvider>
  );
}

export default App;