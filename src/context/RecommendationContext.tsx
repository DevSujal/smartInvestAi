import React, { createContext, useContext, useState, ReactNode } from 'react';

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

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  recommendation?: Recommendation;
}

interface RecommendationContextType {
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  currentRecommendation: Recommendation | null;
  setCurrentRecommendation: (recommendation: Recommendation | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const RecommendationContext = createContext<RecommendationContextType | undefined>(undefined);

export function RecommendationProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI-powered investment advisor. Tell me about your investment goals, risk tolerance, age, and time horizon, and I'll provide personalized portfolio recommendations.",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [currentRecommendation, setCurrentRecommendation] = useState<Recommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <RecommendationContext.Provider 
      value={{
        messages,
        addMessage,
        currentRecommendation,
        setCurrentRecommendation,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </RecommendationContext.Provider>
  );
}

export function useRecommendation() {
  const context = useContext(RecommendationContext);
  if (context === undefined) {
    throw new Error('useRecommendation must be used within a RecommendationProvider');
  }
  return context;
}