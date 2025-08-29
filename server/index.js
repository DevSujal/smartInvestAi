import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import {GoogleGenerativeAI} from "@google/generative-ai"

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini - GoogleGenerativeAI
let gemini = null;
if (process.env.GEMINI_API_KEY) {
  gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// Gemini prompt construction (same JSON format as before)
async function generateAIRecommendation(userInput) {
  const prompt = `As a professional financial advisor, analyze this investment request and provide a comprehensive recommendation in the exact JSON format specified:

User Request: "${userInput}"

Provide your response as a JSON object with this exact structure:
{
  "portfolio": {
    "stocks": number (percentage),
    "bonds": number (percentage),
    "etfs": number (percentage),
    "crypto": number (percentage 0-10),
    "reits": number (percentage 0-15),
    "commodities": number (percentage 0-10)
  },
  "rationale": {
    "stocks": "2-3 sentence explanation",
    "bonds": "2-3 sentence explanation",
    "etfs": "2-3 sentence explanation",
    "crypto": "2-3 sentence explanation",
    "reits": "2-3 sentence explanation",
    "commodities": "2-3 sentence explanation"
  },
  "riskScore": number (1-10),
  "diversificationScore": number (1-10),
  "projections": {
    "1year": {"conservative": number, "expected": number, "optimistic": number},
    "3year": {"conservative": number, "expected": number, "optimistic": number},
    "5year": {"conservative": number, "expected": number, "optimistic": number},
    "10year": {"conservative": number, "expected": number, "optimistic": number}
  },
  "riskAssessment": {
    "marketVolatility": "detailed explanation",
    "liquidityRisk": "detailed explanation", 
    "inflationProtection": "detailed explanation"
  }
}

Important: Portfolio percentages must sum to 100. Base recommendations on user's age, risk tolerance, time horizon, and investment goals.`;

  try {
    const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const responseContent = result.response.text().trim();

    const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Invalid response format from Gemini');
    }
  } catch (error) {
    console.error('Error generating AI recommendation:', error);
    throw error;
  }
}

// Mock recommendation generator
function generateMockRecommendation() {
  return {
    portfolio: {
      stocks: 60,
      bonds: 25,
      etfs: 10,
      reits: 5,
      crypto: 0,
      commodities: 0
    },
    riskScore: 6,
    diversificationScore: 8,
    projections: {
      '1year': { expected: 8.5, conservative: 5.2, optimistic: 12.8 },
      '3year': { expected: 22.1, conservative: 15.8, optimistic: 28.9 },
      '5year': { expected: 41.7, conservative: 28.3, optimistic: 55.2 },
      '10year': { expected: 95.8, conservative: 68.4, optimistic: 123.7 }
    },
    rationale: {
      stocks: "High allocation to equities for long-term growth potential suitable for younger investors",
      bonds: "Government and corporate bonds provide stability and regular income",
      etfs: "Diversified ETFs offer exposure to multiple sectors with lower fees",
      reits: "Real Estate Investment Trusts add diversification and inflation protection"
    },
    riskAssessment: {
      volatility: "Moderate to high volatility expected due to equity-heavy allocation",
      timeHorizon: "Well-suited for long-term investment horizons of 5+ years",
      liquidityRisk: "High liquidity with ability to exit positions quickly",
      inflationRisk: "Good inflation protection through real assets and growth stocks"
    }
  };
}

app.post('/api/recommend', async (req, res) => {
  try {
    const { userInput } = req.body;
    if (!userInput || userInput.trim().length < 10) {
      return res.status(400).json({
        error: 'Please provide a detailed investment request (at least 10 characters)'
      });
    }

    let recommendation;

    if (gemini) {
      try {
        recommendation = await generateAIRecommendation(userInput);
        recommendation.isAI = true;
      } catch (error) {
        // Fallback to mock data
        console.log('Falling back to mock data due to Gemini error:', error.message);
        recommendation = generateMockRecommendation();
        recommendation.isAI = false;
      }
    } else {
      console.log('Using mock data - Gemini API key not provided');
      recommendation = generateMockRecommendation();
      recommendation.isAI = false;
    }

    recommendation.timestamp = new Date().toISOString();
    recommendation.userInput = userInput;

    res.json({
      success: true,
      data: recommendation
    });

  } catch (error) {
    console.error('Error in recommend endpoint:', error);
    res.status(500).json({
      error: 'Failed to generate recommendation',
      details: error.message
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    aiEnabled: !!gemini
  });
});

app.listen(port, () => {
  console.log(`Smart Investment Advisor API running on port ${port}`);
  console.log(`AI Integration: ${gemini ? 'Enabled (Gemini API)' : 'Disabled (Mock Data)'}`);
});
