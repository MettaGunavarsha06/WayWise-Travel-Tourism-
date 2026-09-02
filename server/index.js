/**
 * WayWise Backend Server
 * Securely proxies AI requests to Google Gemini 2.5 Flash without exposing API keys to the frontend.
 * Integrates comprehensive Indian Destination Database for accurate, dynamic travel recommendations.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const {
  destinations,
  findRelevantDestinations,
  buildDestinationContextPrompt,
} = require('./destinationCatalog');

// Load environment variables from .env file with override enabled
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });

const app = express();
const PORT = process.env.PORT || 5000;

// Ultra-Low-Latency Model candidate list (prioritizes high-throughput Flash Lite / Gemma models)
const GEMINI_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-3.6-flash',
  'gemini-flash-latest',
];
const DISPLAY_MODEL_NAME = 'Gemma AI (Flash Lite)';

// Middleware
app.use(cors());
app.use(express.json());

// System instruction for WayWise Travel Assistant
const WAYWISE_SYSTEM_INSTRUCTION = `
You are the WayWise AI Travel Concierge, an intelligent assistant specialized in sustainable, eco-friendly, and cultural tourism across India.
Your mission:
1. Provide personalized travel recommendations and itineraries grounded in our comprehensive Indian Destination Database (covering North, South, West, East, Central, and Northeast India).
2. When asked for recommendations (e.g., summer destinations, beach trips, hill stations, regional tours), offer multiple diverse and suitable places rather than repeatedly recommending only one default place.
3. Recommend local grassroots artisans, tribal cooperatives, certified green homestays, and regional eateries.
4. Suggest smart weather-adaptive swaps (e.g., when rain or extreme heat occurs, recommend indoor museums, galleries, or sheltered venues).
5. Provide crowd mitigation tips and offbeat, hidden-gem alternatives to avoid overtourism.
6. Offer safety guidance, realistic itemized Indian rupee (₹) budgets (lodging, transit, food, activities), and multilingual travel assistance across English, Hindi, Telugu, Tamil, Malayalam, and Kannada.

Keep your tone welcoming, culturally appreciative, practical, concise, and inspiring. Use clear markdown formatting with bold bullet points.
`;

/**
 * Execute Gemini API request with automatic model resolution fallback & backoff
 */
async function callGeminiApi({ contents, apiKey, systemInstruction = WAYWISE_SYSTEM_INSTRUCTION }) {
  let lastError = null;

  for (let attempt = 0; attempt < GEMINI_MODELS.length; attempt++) {
    const model = GEMINI_MODELS[attempt];
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      // Gemma 2B / Flash Lite optimized generation parameters for instant sub-second responses
      const payload = {
        contents,
        generationConfig: {
          temperature: 0.6,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 1024,
        },
      };

      if (systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: systemInstruction }],
        };
      }

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        const parts = data.candidates?.[0]?.content?.parts;
        const text = Array.isArray(parts) ? parts.map((p) => p.text || '').join('\n') : null;
        if (text) {
          return { success: true, text, modelUsed: model };
        }
      }

      // If 404 (model not found / deprecated for this tier) or 429 (rate limit on this model), try next candidate
      if (response.status === 404 || response.status === 429 || data.error?.status === 'NOT_FOUND' || data.error?.status === 'RESOURCE_EXHAUSTED') {
        lastError = data.error?.message || `Model ${model} returned status ${response.status}`;
        // Brief pause before trying next candidate
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }

      // Other API error
      return {
        success: false,
        error: data.error?.message || 'Error from Google Gemini API',
        status: response.status,
      };
    } catch (netErr) {
      lastError = netErr.message;
    }
  }

  return {
    success: false,
    error: lastError || 'Failed to call Gemini API across available models',
    status: 500,
  };
}

/**
 * Helper to detect relevant UI action suggestions from text
 */
function determineActionSuggestion(text, prompt) {
  const combined = (prompt + ' ' + text).toLowerCase();

  if (combined.includes('rain') || combined.includes('weather') || combined.includes('reschedule') || combined.includes('indoor')) {
    return {
      type: 'APPLY_WEATHER_SWAP',
      label: 'Apply Weather Adjustment to Itinerary',
    };
  }
  if (combined.includes('budget') || combined.includes('save') || combined.includes('cost') || combined.includes('optimize') || combined.includes('₹')) {
    return {
      type: 'OPTIMIZE_BUDGET',
      label: 'Apply Budget Optimization',
    };
  }
  if (combined.includes('crowd') || combined.includes('hidden gem') || combined.includes('peaceful') || combined.includes('offbeat')) {
    return {
      type: 'EXPLORE_GEMS',
      label: 'View Hidden Gems on Map',
    };
  }
  if (combined.includes('artisan') || combined.includes('craft') || combined.includes('cooperative') || combined.includes('homestay') || combined.includes('marketplace')) {
    return {
      type: 'VIEW_BUSINESSES',
      label: 'Open Local Marketplace',
    };
  }
  if (combined.includes('near me') || combined.includes('nearby') || combined.includes('map') || combined.includes('attraction')) {
    return {
      type: 'OPEN_MAP',
      label: 'Show Nearby Spots on Map',
    };
  }
  if (combined.includes('plan') || combined.includes('itinerary') || combined.includes('trip')) {
    return {
      type: 'OPEN_PLANNER',
      label: 'Plan Trip Itinerary',
    };
  }
  return null;
}

/**
 * Health check endpoint (does NOT expose key contents)
 */
app.get('/api/health', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  res.json({
    status: 'online',
    service: 'WayWise Backend Server',
    model: DISPLAY_MODEL_NAME,
    totalDestinations: destinations.length,
    apiKeyConfigured: hasKey,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Destinations API endpoint - query structured database
 */
app.get('/api/destinations', (req, res) => {
  const { region, category, season, budget, query } = req.query;
  let results = [...destinations];

  if (region && region !== 'All') {
    results = results.filter((d) => d.region?.toLowerCase() === region.toLowerCase());
  }

  if (category && category !== 'All') {
    results = results.filter((d) => d.category?.toLowerCase().includes(category.toLowerCase()));
  }

  if (season === 'summer') {
    results = results.filter((d) => d.summerSuitability);
  } else if (season === 'winter') {
    results = results.filter((d) => d.winterSuitability);
  } else if (season === 'monsoon') {
    results = results.filter((d) => d.monsoonSuitability);
  }

  if (budget) {
    const maxBudget = Number(budget);
    if (!isNaN(maxBudget)) {
      results = results.filter((d) => d.estimatedCost <= maxBudget);
    }
  }

  if (query) {
    results = findRelevantDestinations(query, 20);
  }

  res.json({
    count: results.length,
    destinations: results,
  });
});

/**
 * Test Gemini connectivity endpoint
 */
app.post('/api/test-gemini', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    return res.status(400).json({
      success: false,
      error: 'GEMINI_API_KEY is not configured in the .env file.',
      hint: 'Please paste your Gemini API key into the .env file located at the project root.',
    });
  }

  const result = await callGeminiApi({
    apiKey,
    contents: [
      {
        role: 'user',
        parts: [{ text: 'Respond with a short greeting confirming WayWise Travel AI connection.' }],
      },
    ],
  });

  if (!result.success) {
    return res.status(result.status || 500).json({
      success: false,
      error: result.error,
    });
  }

  return res.json({
    success: true,
    model: DISPLAY_MODEL_NAME,
    reply: result.text,
  });
});

/**
 * Main Chat Completion Endpoint
 */
app.post('/api/chat', async (req, res) => {
  const { prompt, conversationHistory = [], activeTrip = null, userLanguage = 'en' } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'A prompt string is required in the request body.' });
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    return res.status(401).json({
      error: 'GEMINI_API_KEY is not set.',
      hint: 'Please paste your Google Gemini API key into the .env file at the project root.',
      isMissingKey: true,
    });
  }

  try {
    // Build context header
    let contextHeader = `User Preferred Language: ${userLanguage}.\n`;
    if (activeTrip) {
      contextHeader += `User Active Trip Context: Destination: ${activeTrip.destinationName || 'India'}, Days: ${activeTrip.days || 3}, Travelers: ${activeTrip.travelers || 2}, Budget: ₹${activeTrip.userBudget || 'N/A'}.\n`;
    }

    // Build destination catalog context specifically matching the user's inquiry
    const destinationContext = buildDestinationContextPrompt(prompt);

    // Build message contents array for Gemini
    const contents = [];

    // Add previous conversation turns
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      for (const msg of conversationHistory) {
        if (!msg.text) continue;
        const role = (msg.sender === 'user' || msg.role === 'user') ? 'user' : 'model';
        contents.push({
          role,
          parts: [{ text: msg.text }],
        });
      }
    }

    // Add current user prompt with attached structured destination knowledge
    contents.push({
      role: 'user',
      parts: [{ text: `${contextHeader}\nUser Request: ${prompt}\n${destinationContext}` }],
    });

    const result = await callGeminiApi({
      apiKey,
      contents,
    });

    if (!result.success) {
      return res.status(result.status || 500).json({
        error: result.error,
      });
    }

    const actionSuggestion = determineActionSuggestion(result.text, prompt);

    return res.json({
      model: DISPLAY_MODEL_NAME,
      text: result.text,
      actionSuggestion,
    });
  } catch (err) {
    console.error('Server /api/chat error:', err.message);
    return res.status(500).json({
      error: err.message || 'Internal server error while processing chat',
    });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🌿 WayWise Server running on http://localhost:${PORT}`);
  console.log(`🤖 Model: ${DISPLAY_MODEL_NAME}`);
  console.log(`🏛️ Total Indian Destinations Loaded: ${destinations.length}`);
  console.log(`🔑 Gemini API Key: ${process.env.GEMINI_API_KEY ? 'Configured' : 'NOT SET (add to .env)'}`);
  console.log(`=========================================`);
});
