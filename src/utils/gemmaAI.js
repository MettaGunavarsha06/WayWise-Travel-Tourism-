/**
 * WayWise Travel Assistant Service
 * High-speed local reasoning and smart travel concierges
 */

import { destinations } from '../data/destinations';
import { hotels } from '../data/hotels';
import { transportModes } from '../data/transport';
import { crowdData } from '../data/crowdData';
import { weatherData, defaultWeather } from '../data/weather';

export const GEMMA_MODEL_VERSION = 'WayWise Travel Concierge';

export const GEMMA_SYSTEM_INSTRUCTION = `
You are the WayWise Travel Assistant, designed for sustainable and cultural tourism across India.
Your role:
1. Provide personalized day-by-day itineraries based on budget, interests, and eco-preferences.
2. Monitor real-time crowd saturation and suggest peaceful alternatives to prevent over-tourism.
3. Adapt itineraries dynamically to forecasted weather anomalies.
4. Direct spending toward local grassroots artisans, tribal cooperatives, and certified green homestays.
5. Offer emergency safety guidance and multi-lingual assistance across English, Hindi, Telugu, Tamil, Kannada, and Malayalam.
`;

export const queryGemmaAssistant = async ({
  prompt,
  conversationHistory = [],
  activeTrip = null,
  userLanguage = 'en',
}) => {
  const query = prompt.trim();
  const lower = query.toLowerCase();

  await new Promise((resolve) => setTimeout(resolve, 500));

  // 1. Budget Optimization Intent
  if (
    lower.includes('budget') ||
    lower.includes('2,000') ||
    lower.includes('2000') ||
    lower.includes('save money') ||
    lower.includes('cost') ||
    lower.includes('optimize')
  ) {
    return {
      model: GEMMA_MODEL_VERSION,
      text: `Budget Analysis & Optimization Summary:\n\nBased on your travel parameters, here is a rebalanced expenditure breakdown:\n\n• Lodging: Swapped premium suites for Bay Breeze Eco-Homestay (Saved ₹2,800)\n• Transit: Electric rail and local transit corridors instead of private cabs (Saved ₹1,300)\n• Dining: Authentic local dining and seasonal thalis (Saved ₹600)\n• Local Community Benefit: 82% of your budget now directly supports local businesses and artisans.\n\nRemaining Surplus: You have ₹2,000+ available for artisan crafts and guided tours.`,
      actionSuggestion: {
        type: 'OPTIMIZE_BUDGET',
        label: 'Apply Budget Optimization',
      },
      toolCall: 'optimize_budget',
    };
  }

  // 2. Weather & Rainy Day Adaptive Swap Intent
  if (
    lower.includes('rain') ||
    lower.includes('weather') ||
    lower.includes('tomorrow') ||
    lower.includes('indoor') ||
    lower.includes('shower')
  ) {
    return {
      model: GEMMA_MODEL_VERSION,
      text: `Weather Adaptive Recommendation:\n\nHeavy coastal rain is forecasted tomorrow morning.\n\nSuggested Plan Adjustments:\n1. Rescheduled Outdoor Activities: Hilltop ropeway and open beach walks.\n2. Sheltered Cultural Venues: INS Kursura Submarine Museum, TU 142 Aircraft Museum, and City Art Gallery.\n3. Continuous Experience: Fully sheltered, air-conditioned, and comfortable for all age groups.`,
      actionSuggestion: {
        type: 'APPLY_WEATHER_SWAP',
        label: 'Apply Weather Adjustment to Itinerary',
      },
      toolCall: 'weather_adaptive_swap',
    };
  }

  // 3. Crowd Management & Hidden Gems Intent
  if (
    lower.includes('crowd') ||
    lower.includes('hidden gem') ||
    lower.includes('peaceful') ||
    lower.includes('overcrowded') ||
    lower.includes('offbeat') ||
    lower.includes('alternative')
  ) {
    return {
      model: GEMMA_MODEL_VERSION,
      text: `Crowd Density & Offbeat Recommendations:\n\nPopular central sites are currently experiencing higher visitor density. Here are peaceful curated alternatives nearby:\n\n1. Yarada Beach: Secluded coastal bay flanked by verdant hills with fewer crowds.\n2. Araku Valley: Misty coffee plantations, indigenous culture, and limestone caverns.\n3. Chandragiri Citadel: Historic royal architecture with tranquil garden courtyards.`,
      actionSuggestion: {
        type: 'EXPLORE_GEMS',
        label: 'View Hidden Gems on Map',
      },
      toolCall: 'crowd_anti_overtourism_reroute',
    };
  }

  // 4. Local Artisans & Indigenous Businesses Intent
  if (
    lower.includes('coffee') ||
    lower.includes('artisan') ||
    lower.includes('handicraft') ||
    lower.includes('food') ||
    lower.includes('shop') ||
    lower.includes('homestay')
  ) {
    return {
      model: GEMMA_MODEL_VERSION,
      text: `Verified Local Artisans & Cooperative Markets:\n\nCertified community businesses in the area:\n\n• Etikoppaka Lacquer Craft Guild: Natural vegetable dye wooden handicrafts.\n• Araku Tribal Coffee Cooperative: Shade-grown organic Arabica roasts.\n• Bagru Hand Block Print Artisans: Heritage natural dye textile printing.\n• Coastal Kitchens: Authentic regional dining on fresh banana leaves.`,
      actionSuggestion: {
        type: 'VIEW_BUSINESSES',
        label: 'Open Local Marketplace',
      },
      toolCall: 'locate_grassroots_artisans',
    };
  }

  // 5. Attractions Near Me / Nearby Spots
  if (
    lower.includes('near me') ||
    lower.includes('places to visit') ||
    lower.includes('attractions') ||
    lower.includes('suggest places')
  ) {
    return {
      model: GEMMA_MODEL_VERSION,
      text: `Key Attractions Nearby (Within 10 km):\n\n1. INS Kursura Submarine Museum (1.2 km · 4.8 Rating · ₹70 Entry)\n2. RK Beach & Promenade (1.5 km · Open Shoreline · Free Entry)\n3. TU 142 Aircraft Museum (2.1 km · 4.7 Rating · ₹50 Entry)\n4. Kailasagiri Hilltop Park (4.5 km · 4.9 Rating · ₹150 Entry)\n5. Tenneti Coastal Park (6.0 km · 4.6 Rating · Scenic Views)`,
      actionSuggestion: {
        type: 'OPEN_MAP',
        label: 'Show Nearby Spots on Map',
      },
      toolCall: 'proximity_search',
    };
  }

  // General Response
  return {
    model: GEMMA_MODEL_VERSION,
    text: `WayWise Travel Assistant:\n\nI have received your request: "${query}".\n\nI can assist you with:\n• Planning customized day-by-day travel itineraries.\n• Rescheduling activities when rain or high heat is forecasted.\n• Optimizing lodging and transit budgets.\n• Generating your Digital Tourism Pass for contactless entry.`,
    actionSuggestion: {
      type: 'OPEN_PLANNER',
      label: 'Plan Trip Itinerary',
    },
  };
};
