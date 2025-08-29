import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('Making API request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

interface InvestmentRecommendation {
  portfolio: { [key: string]: number };
  rationale: { [key: string]: string };
  riskScore: number;
  diversificationScore: number;
  projections: {
    [key: string]: {
      conservative: number;
      expected: number;
      optimistic: number;
    };
  };
  riskAssessment: {
    marketVolatility: string;
    liquidityRisk: string;
    inflationProtection: string;
  };
  timestamp: string;
  userInput: string;
  isAI: boolean;
}

// Convert API response to context-compatible format
function convertToRecommendation(apiResponse: InvestmentRecommendation) {
  return {
    ...apiResponse,
    portfolio: {
      stocks: apiResponse.portfolio.stocks || 0,
      bonds: apiResponse.portfolio.bonds || 0,
      etfs: apiResponse.portfolio.etfs || 0,
      crypto: apiResponse.portfolio.crypto,
      reits: apiResponse.portfolio.reits,
      commodities: apiResponse.portfolio.commodities,
    }
  };
}

export async function getInvestmentRecommendation(userInput: string) {
  try {
    const response = await api.post('/recommend', { userInput });

    if (response.data.success) {
      return convertToRecommendation(response.data.data);
    } else {
      throw new Error(response.data.error || 'Failed to get recommendation');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Unable to connect to the recommendation service. Please check if the server is running on port 3001.');
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data.error || 'Invalid request');
      } else if (error.response?.status === 500) {
        throw new Error('Server error occurred while generating recommendation');
      }
    }

    throw new Error('An unexpected error occurred. Please try again.');
  }
}

export async function checkAPIHealth(): Promise<{ status: string; aiEnabled: boolean }> {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('API health check failed');
  }
}