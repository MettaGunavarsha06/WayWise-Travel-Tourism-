/**
 * WayWise Server-Side Destination Catalog & Intelligent Matcher
 * Provides structured Indian destination data to the Gemini Chatbot
 */

const path = require('path');

// Load master destinations from regional modules
const { northIndiaDestinations } = require(path.resolve(__dirname, '../src/data/destinations/northIndia.js'));
const { southIndiaDestinations } = require(path.resolve(__dirname, '../src/data/destinations/southIndia.js'));
const { westIndiaDestinations } = require(path.resolve(__dirname, '../src/data/destinations/westIndia.js'));
const { eastIndiaDestinations } = require(path.resolve(__dirname, '../src/data/destinations/eastIndia.js'));
const { centralIndiaDestinations } = require(path.resolve(__dirname, '../src/data/destinations/centralIndia.js'));
const { northeastIndiaDestinations } = require(path.resolve(__dirname, '../src/data/destinations/northeastIndia.js'));

const allDestinations = [
  ...northIndiaDestinations,
  ...southIndiaDestinations,
  ...westIndiaDestinations,
  ...eastIndiaDestinations,
  ...centralIndiaDestinations,
  ...northeastIndiaDestinations,
];

// Deduplicate
const destinationMap = new Map();
allDestinations.forEach((d) => {
  if (!destinationMap.has(d.id)) {
    destinationMap.set(d.id, d);
  }
});

const destinations = Array.from(destinationMap.values());

/**
 * Intelligent destination matcher based on user query features
 */
function findRelevantDestinations(query, limit = 8) {
  if (!query || typeof query !== 'string') return destinations.slice(0, limit);
  const q = query.toLowerCase();

  const isSummer = q.includes('summer') || q.includes('hot') || q.includes('heat') || q.includes('may') || q.includes('june') || q.includes('april') || q.includes('cool place') || q.includes('beat the heat');
  const isWinter = q.includes('winter') || q.includes('snow') || q.includes('december') || q.includes('january') || q.includes('skiing') || q.includes('cold');
  const isMonsoon = q.includes('monsoon') || q.includes('rain') || q.includes('waterfall') || q.includes('july') || q.includes('august');

  const isBeach = q.includes('beach') || q.includes('coastal') || q.includes('sea') || q.includes('ocean') || q.includes('island') || q.includes('surfing') || q.includes('scuba');
  const isHill = q.includes('hill') || q.includes('mountain') || q.includes('valley') || q.includes('himalaya') || q.includes('ghats') || q.includes('pine') || q.includes('tea estate');
  const isPeaceful = q.includes('peaceful') || q.includes('quiet') || q.includes('offbeat') || q.includes('hidden gem') || q.includes('uncrowded') || q.includes('less crowd') || q.includes('calm') || q.includes('tranquil');
  const isBudget = q.includes('cheap') || q.includes('budget') || q.includes('low cost') || q.includes('affordable') || q.includes('under ₹') || q.includes('under 10000') || q.includes('under 5000') || q.includes('under 15000') || q.includes('inexpensive');
  const isLuxury = q.includes('luxury') || q.includes('resort') || q.includes('5 star') || q.includes('premium');

  const isNorth = q.includes('north') || q.includes('delhi') || q.includes('rajasthan') || q.includes('himachal') || q.includes('uttarakhand') || q.includes('kashmir') || q.includes('ladakh') || q.includes('punjab');
  const isSouth = q.includes('south') || q.includes('kerala') || q.includes('tamil nadu') || q.includes('karnataka') || q.includes('andhra') || q.includes('telangana') || q.includes('pondicherry') || q.includes('hyderabad') || q.includes('bangalore') || q.includes('bengaluru');
  const isWest = q.includes('west') || q.includes('goa') || q.includes('mumbai') || q.includes('gujarat') || q.includes('maharashtra') || q.includes('pune');
  const isEast = q.includes('east') || q.includes('kolkata') || q.includes('bengal') || q.includes('odisha') || q.includes('jharkhand');
  const isCentral = q.includes('central') || q.includes('madhya pradesh') || q.includes('chhattisgarh') || q.includes('bhopal') || q.includes('indore');
  const isNortheast = q.includes('northeast') || q.includes('north-east') || q.includes('seven sisters') || q.includes('sikkim') || q.includes('assam') || q.includes('meghalaya') || q.includes('arunachal') || q.includes('nagaland') || q.includes('mizoram') || q.includes('manipur');

  const isHeritage = q.includes('fort') || q.includes('palace') || q.includes('history') || q.includes('unesco') || q.includes('heritage') || q.includes('monument') || q.includes('architecture');
  const isSpiritual = q.includes('temple') || q.includes('spiritual') || q.includes('jyotirlinga') || q.includes('pilgrimage') || q.includes('holy') || q.includes('ghat') || q.includes('aarti') || q.includes('ashram');
  const isWildlife = q.includes('tiger') || q.includes('safari') || q.includes('wildlife') || q.includes('national park') || q.includes('rhino') || q.includes('elephant') || q.includes('forest');
  const isAdventure = q.includes('trek') || q.includes('rafting') || q.includes('bungee') || q.includes('paragliding') || q.includes('camping') || q.includes('adventure');

  // Score each destination
  const scored = destinations.map((dest) => {
    let score = 0;

    // Explicit name/state match
    if (q.includes(dest.name.toLowerCase())) score += 100;
    if (q.includes(dest.state.toLowerCase())) score += 50;

    // Region match
    if (isNorth && dest.region === 'North India') score += 30;
    if (isSouth && dest.region === 'South India') score += 30;
    if (isWest && dest.region === 'West India') score += 30;
    if (isEast && dest.region === 'East India') score += 30;
    if (isCentral && dest.region === 'Central India') score += 30;
    if (isNortheast && (dest.region === 'Northeast India' || dest.region === 'East India')) score += 30;

    // Season match
    if (isSummer && dest.summerSuitability) score += 40;
    if (isSummer && !dest.summerSuitability) score -= 30;
    if (isWinter && dest.winterSuitability) score += 25;
    if (isMonsoon && dest.monsoonSuitability) score += 35;

    // Category / Feature match
    if (isBeach && dest.category.includes('Beaches')) score += 50;
    if (isHill && dest.category.includes('Hills')) score += 40;
    if (isHeritage && dest.category.includes('Heritage')) score += 35;
    if (isSpiritual && dest.category.includes('Spiritual')) score += 35;
    if (isWildlife && dest.category.includes('Wildlife')) score += 45;
    if (isAdventure && dest.category.includes('Adventure')) score += 35;

    // Crowd preference
    if (isPeaceful && (dest.crowdLevel === 'low' || dest.isHiddenGem)) score += 40;
    if (isPeaceful && dest.crowdLevel === 'high') score -= 25;

    // Budget preference
    if (isBudget && (dest.budgetCategory === 'Budget' || dest.estimatedCost <= 10000)) score += 35;
    if (isLuxury && (dest.budgetCategory === 'Luxury' || dest.estimatedCost >= 15000)) score += 30;

    // Tag matching
    if (dest.tags) {
      dest.tags.forEach((tag) => {
        if (q.includes(tag.toLowerCase())) score += 15;
      });
    }

    return { dest, score };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Return top matching destinations
  return scored.slice(0, limit).map((s) => s.dest);
}

/**
 * Generate a clean, compact destination context string for Gemini prompt injection
 */
function buildDestinationContextPrompt(query) {
  const relevantDestinations = findRelevantDestinations(query, 6);

  let text = `\n[WAYWISE DESTINATION DATABASE CONTEXT]\n`;
  text += `Here are prime structured destinations from the WayWise Indian Database matching the traveler's request:\n\n`;

  relevantDestinations.forEach((d, idx) => {
    text += `${idx + 1}. **${d.name}** (${d.state} - ${d.region})\n`;
    text += `   - **Category**: ${d.category} | **Crowd Level**: ${d.crowdLevel} (Eco Score: ${d.ecoScore}/100)\n`;
    text += `   - **Estimated Cost**: ₹${d.estimatedCost} for ${d.duration} (${d.budgetCategory})\n`;
    text += `   - **Best Time & Season Suitability**: ${d.bestTimeToVisit} (Summer: ${d.summerSuitability ? 'Yes' : 'No'}, Winter: ${d.winterSuitability ? 'Yes' : 'No'}, Monsoon: ${d.monsoonSuitability ? 'Yes' : 'No'})\n`;
    text += `   - **Key Attractions**: ${d.attractions?.map((a) => a.name).join(', ') || 'Scenic heritage & nature sites'}\n`;
    text += `   - **Nature & Adventure**: ${d.natureAttractions?.slice(0, 3).join(', ')} | ${d.adventureActivities?.slice(0, 2).join(', ')}\n`;
    text += `   - **Food Specialties**: ${d.foodSpecialties?.slice(0, 4).join(', ')}\n`;
    text += `   - **Description**: ${d.description}\n\n`;
  });

  text += `Instructions for WayWise Assistant:
- Ground your recommendation in the above destination data when suitable.
- Recommend MULTIPLE diverse places rather than defaulting to only one single location.
- Provide practical travel tips, realistic Indian rupee (₹) budgets, crowd avoidance advice, and local food specialties.
- Avoid repeating the same destination if a broad question is asked.
`;

  return text;
}

module.exports = {
  destinations,
  findRelevantDestinations,
  buildDestinationContextPrompt,
};
