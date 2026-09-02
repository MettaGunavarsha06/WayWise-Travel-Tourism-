/**
 * WayWise Offline Travel Knowledge Base
 * Generated from comprehensive travel planning dataset (639 verified QA entries)
 * Provides instant answers and recommendations for budget, transport, food, itineraries, and suitability.
 */

import qaData from './travelKnowledgeBase.json';

export const TRAVEL_KNOWLEDGE_BASE = qaData;

// Unique destinations list in the knowledge base
export const KNOWLEDGE_DESTINATIONS = Array.from(
  new Set(qaData.map((item) => item.destination).filter(Boolean))
).sort();

// Destination-grouped indexing for instant O(1) lookup
const destinationIndex = {};
qaData.forEach((item) => {
  const destKey = item.destination.toLowerCase();
  if (!destinationIndex[destKey]) {
    destinationIndex[destKey] = [];
  }
  destinationIndex[destKey].push(item);
});

/**
 * Search the Travel Knowledge Base for matching questions and answers
 * @param {string} query - User search query
 * @param {string} [destination] - Optional destination filter
 * @param {number} [limit=5] - Maximum number of results to return
 * @returns {Array} Array of matching QA objects with relevance score
 */
export const searchKnowledgeBase = (query, destination = null, limit = 5) => {
  if (!query || typeof query !== 'string') return [];
  const cleanQuery = query.toLowerCase().trim();
  const queryTokens = cleanQuery.split(/\s+/).filter((t) => t.length > 2);

  let pool = qaData;
  if (destination) {
    const destKey = destination.toLowerCase().trim();
    if (destinationIndex[destKey]) {
      pool = destinationIndex[destKey];
    }
  }

  const scored = [];

  for (const item of pool) {
    let score = 0;
    const qLower = item.question.toLowerCase();
    const aLower = item.answer.toLowerCase();
    const dLower = item.destination.toLowerCase();

    // Exact question match
    if (qLower === cleanQuery) {
      score += 100;
    } else if (qLower.includes(cleanQuery)) {
      score += 50;
    }

    // Destination match
    if (dLower === cleanQuery || cleanQuery.includes(dLower)) {
      score += 25;
    }

    // Token matching
    for (const token of queryTokens) {
      if (qLower.includes(token)) score += 10;
      if (aLower.includes(token)) score += 3;
    }

    if (score > 0) {
      scored.push({ ...item, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
};

/**
 * Get curated FAQs / Quick prompt questions by category
 */
export const getCuratedPrompts = () => {
  return [
    {
      category: 'Budget Split',
      icon: 'wallet-outline',
      question: 'How should I split a ₹50,000 budget for 5 days?',
      destination: 'Rome',
    },
    {
      category: 'Local Food',
      icon: 'restaurant-outline',
      question: 'What food should I try in Hyderabad?',
      destination: 'Hyderabad',
    },
    {
      category: 'Transport',
      icon: 'bus-outline',
      question: 'What is the best transport option in Bengaluru?',
      destination: 'Bengaluru',
    },
    {
      category: 'Cost Saving',
      icon: 'trending-down-outline',
      question: 'How can I reduce my travel cost in Goa?',
      destination: 'Goa',
    },
    {
      category: 'Itinerary',
      icon: 'calendar-outline',
      question: 'How can I make a 4-day itinerary for Visakhapatnam?',
      destination: 'Visakhapatnam',
    },
    {
      category: 'Suitability',
      icon: 'checkmark-circle-outline',
      question: 'Is Bali suitable for a budget trip?',
      destination: 'Bali',
    },
  ];
};
