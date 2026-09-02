/**
 * WayWise Comprehensive Indian Destination Database
 * Combines structured destinations across North, South, West, East, Central, and Northeast India.
 */

import { northIndiaDestinations } from './destinations/northIndia.js';
import { southIndiaDestinations } from './destinations/southIndia.js';
import { westIndiaDestinations } from './destinations/westIndia.js';
import { eastIndiaDestinations } from './destinations/eastIndia.js';
import { centralIndiaDestinations } from './destinations/centralIndia.js';
import { northeastIndiaDestinations } from './destinations/northeastIndia.js';

// Combine all regions into a single comprehensive catalog with duplicate prevention
const allRegionalLists = [
  ...northIndiaDestinations,
  ...southIndiaDestinations,
  ...westIndiaDestinations,
  ...eastIndiaDestinations,
  ...centralIndiaDestinations,
  ...northeastIndiaDestinations,
];

// Deduplicate by ID
const destinationMap = new Map();
allRegionalLists.forEach((dest) => {
  if (!destinationMap.has(dest.id)) {
    destinationMap.set(dest.id, dest);
  }
});

export const destinations = Array.from(destinationMap.values());

// =====================================================================
// HELPER QUERY FUNCTIONS FOR FRONTEND SCREENS & GEMINI BACKEND
// =====================================================================

/**
 * Get all destinations by Region (e.g. 'North India', 'South India', 'West India', 'East India', 'Central India', 'Northeast India')
 */
export const getDestinationsByRegion = (region) => {
  if (!region || region === 'All') return destinations;
  return destinations.filter(
    (d) => d.region?.toLowerCase() === region.toLowerCase()
  );
};

/**
 * Get all destinations by Category (e.g. 'Hills & Nature', 'Beaches & Coastal', 'Heritage & Culture', 'Spiritual & Pilgrimage', 'Wildlife & Eco', 'Adventure & Trekking')
 */
export const getDestinationsByCategory = (category) => {
  if (!category || category === 'All') return destinations;
  return destinations.filter((d) =>
    d.category?.toLowerCase().includes(category.toLowerCase())
  );
};

/**
 * Get destinations suited for Summer travel (high summer suitability, hill stations, high-altitude mountain valleys)
 */
export const getSummerDestinations = () => {
  return destinations.filter((d) => d.summerSuitability === true);
};

/**
 * Get destinations suited for Winter travel
 */
export const getWinterDestinations = () => {
  return destinations.filter((d) => d.winterSuitability === true);
};

/**
 * Get destinations suited for Monsoon travel (lush waterfalls, rainforest valleys)
 */
export const getMonsoonDestinations = () => {
  return destinations.filter((d) => d.monsoonSuitability === true);
};

/**
 * Get destinations matching budget constraint (<= maxBudget)
 */
export const getBudgetDestinations = (maxBudget = 10000) => {
  return destinations.filter((d) => d.estimatedCost <= maxBudget);
};

/**
 * Get all curated offbeat Hidden Gems
 */
export const getHiddenGems = () => {
  return destinations.filter((d) => d.isHiddenGem === true);
};

/**
 * Get all Trending destinations
 */
export const getTrendingDestinations = () => {
  return destinations.filter((d) => d.isTrending === true);
};

/**
 * Search destinations across name, state, region, description, food specialties, and tags
 */
export const searchDestinations = (query) => {
  if (!query || !query.trim()) return destinations;
  const q = query.toLowerCase().trim();
  return destinations.filter((d) => {
    return (
      d.name?.toLowerCase().includes(q) ||
      d.state?.toLowerCase().includes(q) ||
      d.region?.toLowerCase().includes(q) ||
      d.category?.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q) ||
      d.tags?.some((tag) => tag.toLowerCase().includes(q)) ||
      d.foodSpecialties?.some((f) => f.toLowerCase().includes(q)) ||
      d.natureAttractions?.some((n) => n.toLowerCase().includes(q)) ||
      d.culturalAttractions?.some((c) => c.toLowerCase().includes(q)) ||
      d.adventureActivities?.some((a) => a.toLowerCase().includes(q))
    );
  });
};

/**
 * Find a single destination by its unique ID
 */
export const getDestinationById = (id) => {
  return destinations.find((d) => d.id === id) || null;
};
