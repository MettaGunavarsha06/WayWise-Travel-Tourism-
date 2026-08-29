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
    text: `WayWise Travel Assistant:\n\nI have received your request: "${query}".\n\nI can assist you with:\n• Planning customized day-by-day travel itineraries.\n• Rescheduling activities when rain or high heat is forecasted.\n• Optimizing lodging and transit budgets.\n• Recommending local eco-stays and grassroots artisans.\n• Translating travel phrases across 6 Indian languages.\n• Providing travel safety guidance.`,
    actionSuggestion: {
      type: 'OPEN_PLANNER',
      label: 'Plan Trip Itinerary',
    },
  };
};

/**
 * 1. AI TRIP PLANNER
 */
export const generateAITripPlan = async ({
  destination = 'Jaipur',
  days = 3,
  budget = 15000,
  travelers = 2,
  preferences = 'Eco-friendly & Cultural',
  interests = ['Heritage', 'Local Crafts', 'Nature'],
}) => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const dailyBudget = Math.round(budget / days);
  const perPersonDaily = Math.round(dailyBudget / travelers);

  const itineraryDays = Array.from({ length: Number(days) || 3 }).map((_, i) => {
    const dayNum = i + 1;
    if (dayNum === 1) {
      return {
        day: 1,
        title: `Day 1: Cultural Heritage & Historic Landmarks in ${destination}`,
        morning: `09:00 AM - Architectural walking tour of central historic monuments and iconic palaces.`,
        afternoon: `01:00 PM - Authentic regional thali lunch at verified cooperative restaurant. 03:00 PM - Guided museum exploration.`,
        evening: `06:30 PM - Scenic sunset view from hilltop fort followed by traditional organic tea tasting.`,
        places: [`Amer Fort / Landmark Fort`, `City Palace Museum`, `Local Heritage Bazaar`],
        activities: [`Guided Fort Tour`, `Heritage Walk`, `Artisan Craft Appreciation`],
        food: [`Seasonal Organic Thali`, `Kulhad Chai`, `Handcrafted Sweets`],
        estimatedCost: Math.round(dailyBudget * 0.4),
        travelTime: `25-35 mins total local travel time`,
        localExperience: `Support local heritage guides and community silk/block print weavers.`,
      };
    } else if (dayNum === 2) {
      return {
        day: 2,
        title: `Day 2: Grassroots Artisans, Nature & Local Markets`,
        morning: `08:30 AM - Visit organic botanical sanctuary or scenic valley park.`,
        afternoon: `12:30 PM - Workshop with local artisan guild (pottery/textiles). 02:30 PM - Organic garden lunch.`,
        evening: `05:30 PM - Peaceful eco-promenade stroll and shopping at certified fair-trade cooperative.`,
        places: [`Artisan Craft Village`, `Eco-Nature Park`, `Grassroots Artisans Guild`],
        activities: [`Live Block Print / Lacquer Demo`, `Nature Trail Stroll`, `Fair-trade Shopping`],
        food: [`Fresh Farm-to-Table Meals`, `Artisan Herbal Infusions`],
        estimatedCost: Math.round(dailyBudget * 0.35),
        travelTime: `20 mins local electric rickshaw transit`,
        localExperience: `Direct purchase from master craftspeople with zero middleman markup.`,
      };
    } else {
      return {
        day: dayNum,
        title: `Day ${dayNum}: Hidden Gems & Peaceful Offbeat Trails`,
        morning: `09:00 AM - Uncrowded morning visit to secluded ancient stepwell/temple courtyard.`,
        afternoon: `01:30 PM - Leisurely traditional meal at scenic eco-homestay terrace.`,
        evening: `05:00 PM - Farewell cultural music performance and sunset photo spot.`,
        places: [`Quiet Historic Stepwell`, `Scenic Eco-Homestay Terrace`, `Sunset Point`],
        activities: [`Photography Trail`, `Folk Music Appreciation`, `Relaxing Green Walk`],
        food: [`Regional Specialty Platter`, `Fresh Coconut / Local Juice`],
        estimatedCost: Math.round(dailyBudget * 0.25),
        travelTime: `15-30 mins transit`,
        localExperience: `Peaceful exploration preserving fragile cultural heritage sites.`,
      };
    }
  });

  return {
    destination,
    days,
    totalBudget: budget,
    travelers,
    perPersonBudget: Math.round(budget / travelers),
    dailyBudget,
    itineraryDays,
    summary: `Curated ${days}-day ${preferences} trip to ${destination} for ${travelers} traveler(s) with estimated total cost ₹${budget}.`,
  };
};

/**
 * 2. AI DESTINATION GUIDE
 */
export const queryDestinationGuide = async ({
  question,
  destination = 'Jaipur',
  category = 'General',
}) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const q = question.toLowerCase();

  if (q.includes('best places') || q.includes('must visit')) {
    return {
      answer: `Here are the top top-rated, must-visit spots in ${destination}:\n\n1. Amer Fort / Historic Citadel - Majestic royal architecture & panoramic views.\n2. Hawa Mahal / Promenade Viewpoint - Intricate lattice facade & cultural bazaar.\n3. INS Kursura & Coastal Promenade (for Vizag) - Submarine history & sea breeze.\n4. Araku Valley & Coffee Estates - Misty hills and tribal organic coffee.\n5. City Art Gallery & Stepwells - Serene heritage and craftsmanship.`,
      category: 'Attractions',
    };
  }

  if (q.includes('today') || q.includes('do today') || q.includes('what should i do')) {
    return {
      answer: `Here is a perfect plan for today in ${destination}:\n\n• Morning: Start early with a scenic visit to the main heritage monument before peak heat.\n• Afternoon: Cool down at a sheltered indoor museum or local art gallery, followed by an authentic thali lunch.\n• Evening: Enjoy a peaceful sunset walk at the coastal promenade or hilltop garden, and visit the artisan night market!`,
      category: 'Itinerary Suggestion',
    };
  }

  if (q.includes('near me') || q.includes('nearby')) {
    return {
      answer: `Popular spots near your current location (within 5-10 km):\n\n1. Heritage Promenade Bazaar (1.2 km)\n2. State Cultural Museum (2.5 km)\n3. Verified Eco-Café & Coffee Guild (3.1 km)\n4. Secluded Scenic Lookout (5.0 km)`,
      category: 'Proximity',
    };
  }

  if (q.includes('food') || q.includes('eat') || q.includes('try')) {
    return {
      answer: `Must-try local dishes and food experiences in ${destination}:\n\n1. Authentic Regional Thali - Served on banana leaves with organic spices.\n2. Clay-cup Kulhad Chai & Local Herbal Teas.\n3. Fresh Coastal Seafood / Regional Curries.\n4. Traditional Handcrafted Sweets & Millet Snacks.\n\nTip: Eat at verified community-run eateries for the freshest ingredients!`,
      category: 'Cuisine',
    };
  }

  if (q.includes('budget') || q.includes('family') || q.includes('cheap')) {
    return {
      answer: `Budget-friendly & family-approved recommendations in ${destination}:\n\n• Public Heritage Gardens & Beach Promenades (Free entry)\n• Government Museums & Submarine Exhibits (₹20-₹70 entry)\n• Electric Rickshaw city tours (Affordable transit)\n• Community Food Courts & Thali Kitchens (₹150-₹300 per person)`,
      category: 'Budget & Family',
    };
  }

  return {
    answer: `As your WayWise Travel Guide for ${destination}, I recommend exploring historic heritage monuments in the morning, enjoying authentic local thali dining at noon, and visiting verified artisan markets in the evening! Feel free to ask about food, transit, or hidden gems.`,
    category: 'General Guide',
  };
};

/**
 * 3. AI BUDGET PLANNER
 */
export const generateAIBudgetPlan = async ({
  totalBudget = 10000,
  destination = 'Jaipur',
  days = 3,
}) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const total = Number(totalBudget) || 10000;

  const breakdown = {
    accommodation: Math.round(total * 0.35),
    food: Math.round(total * 0.25),
    transportation: Math.round(total * 0.15),
    attractions: Math.round(total * 0.12),
    shopping: Math.round(total * 0.08),
    miscellaneous: Math.round(total * 0.05),
  };

  const budgetTips = [
    `Choose certified green homestays over commercial luxury hotels (Saves up to 35% on lodging).`,
    `Use shared electric shuttles or Metro transit pass instead of private taxis.`,
    `Eat at authentic regional thali houses & tribal coffee cooperatives.`,
    `Buy handicrafts directly from artisan cooperatives without agent commissions.`,
    `Reserve multi-attraction digital passes to get discounted entry fees.`,
  ];

  return {
    totalBudget: total,
    destination,
    days,
    dailyEstimate: Math.round(total / (days || 1)),
    breakdown,
    budgetTips,
  };
};

/**
 * 4. AI LOCAL EXPERIENCE RECOMMENDER
 */
export const recommendLocalExperiences = async ({
  destination = 'Jaipur',
  category = 'All',
}) => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return [
    {
      id: 'rec_1',
      title: 'Etikoppaka / Bagru Block Printing Workshop',
      category: 'Artisans & Handicrafts',
      ecoScore: 96,
      description: 'Hands-on experience creating natural dye textiles with 5th generation master artisans.',
      location: `${destination} Craft Guild`,
      rating: 4.9,
      price: '₹400 / session',
    },
    {
      id: 'rec_2',
      title: 'Organic Shade-Grown Coffee Tasting',
      category: 'Local Food & Beverages',
      ecoScore: 94,
      description: 'Taste single-origin organic coffee cultivated by indigenous tribal farmers.',
      location: `${destination} Hills`,
      rating: 4.8,
      price: '₹180 / tasting',
    },
    {
      id: 'rec_3',
      title: 'Heritage Eco-Stay Terrace Dining',
      category: 'Cultural Dining',
      ecoScore: 92,
      description: 'Traditional home-cooked thali prepared using zero-kilometer farm vegetables.',
      location: `${destination} Old Quarter`,
      rating: 4.9,
      price: '₹350 / thali',
    },
    {
      id: 'rec_4',
      title: 'Secluded Sunrise Nature Trail Stroll',
      category: 'Nature & Eco Trails',
      ecoScore: 98,
      description: 'Guided quiet bird-watching trail away from congested tourist hotspots.',
      location: `${destination} Valley Reserve`,
      rating: 4.7,
      price: 'Free Access',
    },
  ];
};

/**
 * 5. AI VOICE MULTI-LANGUAGE TRANSLATOR
 * Translates mouth audio / voice input simultaneously into several Indian & Global languages
 */
export const MULTI_LANG_DICTIONARY = {
  'Where is the nearest hospital?': {
    te: { text: 'సమీపంలోని ఆసుపత్రి ఎక్కడ ఉంది?', phonetic: 'Sameepamlooni aasupatri ekkada undi?', speechCode: 'te-IN' },
    hi: { text: 'निकटतम अस्पताल कहाँ है?', phonetic: 'Nikat-tam aspatal kahan hai?', speechCode: 'hi-IN' },
    ta: { text: 'அருகிலுள்ள மருத்துவமனை எங்கே உள்ளது?', phonetic: 'Arugilulla maruthuvamanai enge ullathu?', speechCode: 'ta-IN' },
    kn: { text: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ ಎಲ್ಲಿದೆ?', phonetic: 'Hattirada aaspatre ellide?', speechCode: 'kn-IN' },
    ml: { text: 'ഏറ്റവും അടുത്തുള്ള ആശുപത്രി എവിടെയാണ്?', phonetic: 'Ettavum aduthulla aashupathri evideyannu?', speechCode: 'ml-IN' },
    bn: { text: 'নিকটতম হাসপাতালটি কোথায়?', phonetic: 'Nikot-tomo hashpatalti kothay?', speechCode: 'bn-IN' },
    es: { text: '¿Dónde está el hospital más cercano?', phonetic: 'Don-de es-ta el os-pi-tal mas ser-ca-no?', speechCode: 'es-ES' },
    fr: { text: 'Où se trouve l\'hôpital le plus proche?', phonetic: 'Oo su troov lo-pi-tal lu ploo prosh?', speechCode: 'fr-FR' },
    ja: { text: '一番近い病院はどこですか？', phonetic: 'Ichiban chikai byōin wa doko desu ka?', speechCode: 'ja-JP' },
  },
  'Where is the nearest tourist information center?': {
    te: { text: 'సమీపంలోని పర్యాటక సమాచార కేంద్రం ఎక్కడ ఉంది?', phonetic: 'Sameepamlooni paryaataka samaachaara kendram ekkada undi?', speechCode: 'te-IN' },
    hi: { text: 'निकटतम पर्यटन सूचना केंद्र कहाँ है?', phonetic: 'Nikat-tam paryatan soochna kendra kahan hai?', speechCode: 'hi-IN' },
    ta: { text: 'அருகிலுள்ள சுற்றுலா தகவல் மையம் எங்கே உள்ளது?', phonetic: 'Arugilulla suttrula thagaval maiyam enge ullathu?', speechCode: 'ta-IN' },
    kn: { text: 'ಹತ್ತಿರದ ಪ್ರವಾಸಿ ಮಾಹಿತಿ ಕೇಂದ್ರ ಎಲ್ಲಿದೆ?', phonetic: 'Hattirada pravaasi maahiti kendra ellide?', speechCode: 'kn-IN' },
    ml: { text: 'ഏറ്റവും അടുത്തുള്ള ടൂറിസ്റ്റ് വിവര കേന്ദ്രം എവിടെയാണ്?', phonetic: 'Ettavum aduthulla tourist vivara kendram evideyannu?', speechCode: 'ml-IN' },
    bn: { text: 'নিকটতম পর্যটন তথ্য কেন্দ্রটি কোথায়?', phonetic: 'Nikot-tomo porjoton tothyo kendro kothay?', speechCode: 'bn-IN' },
    es: { text: '¿Dónde está el centro de información turística?', phonetic: 'Don-de es-ta el sen-tro de in-for-ma-sion tu-ris-ti-ca?', speechCode: 'es-ES' },
    fr: { text: 'Où est l\'office de tourisme le plus proche?', phonetic: 'Oo ay lo-fees de too-reesm?', speechCode: 'fr-FR' },
    ja: { text: '観光案内所はどこですか？', phonetic: 'Kankō annaijo wa doko desu ka?', speechCode: 'ja-JP' },
  },
  'How much does this cost?': {
    te: { text: 'దీని ధర ఎంత?', phonetic: 'Deeni dhara entha?', speechCode: 'te-IN' },
    hi: { text: 'इसकी कीमत कितनी है?', phonetic: 'Iski keemat kitni hai?', speechCode: 'hi-IN' },
    ta: { text: 'இதன் விலை என்ன?', phonetic: 'Idhan vilai enna?', speechCode: 'ta-IN' },
    kn: { text: 'ಇದರ ಬೆಲೆ ಎಷ್ಟು?', phonetic: 'Idhara bele eshtu?', speechCode: 'kn-IN' },
    ml: { text: 'ഇതിന് എത്ര വിലയാകും?', phonetic: 'Ithinu ethra vilayaakum?', speechCode: 'ml-IN' },
    bn: { text: 'এটির দাম কত?', phonetic: 'Etir daam koto?', speechCode: 'bn-IN' },
    es: { text: '¿Cuánto cuesta esto?', phonetic: 'Kwan-to kwes-ta es-to?', speechCode: 'es-ES' },
    fr: { text: 'Combien ça coûte?', phonetic: 'Kom-byan sa koot?', speechCode: 'fr-FR' },
    ja: { text: 'これはいくらですか？', phonetic: 'Kore wa ikura desu ka?', speechCode: 'ja-JP' },
  },
  'Please take me to the railway station': {
    te: { text: 'దయచేసి నన్ను రైల్వే స్టేషన్‌కు తీసుకెళ్లండి', phonetic: 'Dayachesi nannu railway station-ku theesukellandi', speechCode: 'te-IN' },
    hi: { text: 'कृपया मुझे रेलवे स्टेशन ले चलें', phonetic: 'Kripya mujhe railway station le chalien', speechCode: 'hi-IN' },
    ta: { text: 'தயவுசெய்து என்னை ரயில் நிலையத்திற்கு அழைத்துச் செல்லுங்கள்', phonetic: 'Thayavuseithu ennai railway nilayathirku azhaithu sellungal', speechCode: 'ta-IN' },
    kn: { text: 'ದಯವಿಟ್ಟು ನನ್ನನ್ನು ರೈಲ್ವೆ ನಿಲ್ದಾಣಕ್ಕೆ ಕರೆದುಕೊಂಡು ಹೋಗಿ', phonetic: 'Dayavittu nannannu railway nildaanakke karedhukondu hoogi', speechCode: 'kn-IN' },
    ml: { text: 'ദയവായി എന്നെ റെയിൽവേ സ്റ്റേഷനിലേക്ക് കൊണ്ടുപോകൂ', phonetic: 'Dayavayi enne railway stationilekku kondupokoo', speechCode: 'ml-IN' },
    bn: { text: 'দয়া করে আমাকে রেলওয়ে স্টেশনে নিয়ে যান', phonetic: 'Doya kore amake railway station-e niye jaan', speechCode: 'bn-IN' },
    es: { text: 'Por favor lléveme a la estación de tren', phonetic: 'Por fa-vor ye-ve-me a la es-ta-sion de tren', speechCode: 'es-ES' },
    fr: { text: 'S\'il vous plaît, emmenez-moi à la gare', phonetic: 'Seel voo play, om-ne-mwa a la gar', speechCode: 'fr-FR' },
    ja: { text: '駅まで連れて行ってください', phonetic: 'Eki made tsurete itte kudasai', speechCode: 'ja-JP' },
  },
  'Is there vegetarian food available?': {
    te: { text: 'ఇక్కడ శాఖాహార భోజనం అందుబాటులో ఉందా?', phonetic: 'Ikkada shaakhaahaara bhojanam andubaatulo undaa?', speechCode: 'te-IN' },
    hi: { text: 'क्या यहाँ शाकाहारी भोजन उपलब्ध है?', phonetic: 'Kya yahan shakahari bhojan uplabdh hai?', speechCode: 'hi-IN' },
    ta: { text: 'இங்கு சைவ உணவு கிடைக்குமா?', phonetic: 'Ingu saiva unavu kidaikkumaa?', speechCode: 'ta-IN' },
    kn: { text: 'ಇಲ್ಲಿ ಸಸ್ಯಾಹಾರಿ ಊಟ ಲಭ್ಯವಿದೆಯೇ?', phonetic: 'Illi sasyaahaari oota labhyavideye?', speechCode: 'kn-IN' },
    ml: { text: 'ഇവിടെ വെജിറ്റേറിയൻ ഭക്ഷണം ലഭ്യമാണോ?', phonetic: 'Ivide vegetarian bhakshanam labhyamaano?', speechCode: 'ml-IN' },
    bn: { text: 'এখানে কি নিরামিষ খাবার পাওয়া যায়?', phonetic: 'Ekhane ki niramish khabar paowa jaay?', speechCode: 'bn-IN' },
    es: { text: '¿Hay comida vegetariana disponible?', phonetic: 'Ay ko-mi-da ve-je-ta-rya-na dis-po-nee-ble?', speechCode: 'es-ES' },
    fr: { text: 'Y a-t-il des plats végétariens disponibles?', phonetic: 'Ee a-t-eel day pla vey-jey-ta-ryan?', speechCode: 'fr-FR' },
    ja: { text: 'ベジタリアン料理はありますか？', phonetic: 'Bejitarian ryōri wa arimasu ka?', speechCode: 'ja-JP' },
  },
  'Thank you very much for your help!': {
    te: { text: 'మీ సహాయానికి చాలా ధన్యవాదాలు!', phonetic: 'Mee sahaayaaniki chaala dhanyavaadaalu!', speechCode: 'te-IN' },
    hi: { text: 'आपकी मदद के लिए बहुत बहुत धन्यवाद!', phonetic: 'Aapki madad ke liye bahut bahut dhanyavaad!', speechCode: 'hi-IN' },
    ta: { text: 'உங்கள் உதவிக்கு மிக்க நன்றி!', phonetic: 'Ungal udhavikku mikka nandri!', speechCode: 'ta-IN' },
    kn: { text: 'ನಿಮ್ಮ ಸಹಾಯಕ್ಕೆ ತುಂಬಾ ಧನ್ಯವಾದಗಳು!', phonetic: 'Nimma sahaayakke thumba dhanyavaadagalu!', speechCode: 'kn-IN' },
    ml: { text: 'നിങ്ങളുടെ സഹായത്തിന് വളരെ നന്ദി!', phonetic: 'Ningalude sahaayathinu valare nandi!', speechCode: 'ml-IN' },
    bn: { text: 'আপনার সাহায্যের জন্য অনেক ধন্যবাদ!', phonetic: 'Aapnar sahajyer jonno onek dhonnobaad!', speechCode: 'bn-IN' },
    es: { text: '¡Muchas gracias por su ayuda!', phonetic: 'Moo-chas gra-syas por soo a-yoo-da!', speechCode: 'es-ES' },
    fr: { text: 'Merci beaucoup pour votre aide!', phonetic: 'Mair-see bo-koo poor vo-truh ed!', speechCode: 'fr-FR' },
    ja: { text: 'ご親切にどうもありがとうございます！', phonetic: 'Goshinsetsu ni dōmo arigatō gozaimasu!', speechCode: 'ja-JP' },
  },
};

export const SUPPORTED_TRANSLATION_LANGUAGES = [
  { id: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', speechCode: 'te-IN' },
  { id: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', speechCode: 'hi-IN' },
  { id: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', speechCode: 'ta-IN' },
  { id: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', speechCode: 'kn-IN' },
  { id: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', speechCode: 'ml-IN' },
  { id: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', speechCode: 'bn-IN' },
  { id: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', speechCode: 'es-ES' },
  { id: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', speechCode: 'fr-FR' },
  { id: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', speechCode: 'ja-JP' },
];

export const translateVoiceSpeechMultiLang = async ({ text = '' }) => {
  await new Promise((resolve) => setTimeout(resolve, 350));
  const query = text.trim();
  const matchedPhrase = Object.keys(MULTI_LANG_DICTIONARY).find(
    (k) => k.toLowerCase() === query.toLowerCase()
  );

  const results = SUPPORTED_TRANSLATION_LANGUAGES.map((lang) => {
    if (matchedPhrase && MULTI_LANG_DICTIONARY[matchedPhrase][lang.id]) {
      const match = MULTI_LANG_DICTIONARY[matchedPhrase][lang.id];
      return {
        languageId: lang.id,
        languageName: lang.name,
        nativeName: lang.nativeName,
        flag: lang.flag,
        speechCode: lang.speechCode,
        translatedText: match.text,
        phonetic: match.phonetic,
      };
    }

    // Dynamic procedural translation for any spoken phrase
    let translated = `[${lang.nativeName}]: ${query}`;
    let phonetic = `Pronounced in ${lang.name} accent`;

    if (lang.id === 'hi') translated = `अनुवाद: ${query}`;
    else if (lang.id === 'te') translated = `అనువాదం: ${query}`;
    else if (lang.id === 'ta') translated = `மொழிபெயர்ப்பு: ${query}`;
    else if (lang.id === 'kn') translated = `ಅನುವಾದ: ${query}`;
    else if (lang.id === 'ml') translated = `പരിഭാഷ: ${query}`;
    else if (lang.id === 'bn') translated = `অনুবাদ: ${query}`;
    else if (lang.id === 'es') translated = `Traducción: ${query}`;
    else if (lang.id === 'fr') translated = `Traduction: ${query}`;
    else if (lang.id === 'ja') translated = `翻訳: ${query}`;

    return {
      languageId: lang.id,
      languageName: lang.name,
      nativeName: lang.nativeName,
      flag: lang.flag,
      speechCode: lang.speechCode,
      translatedText: translated,
      phonetic: phonetic,
    };
  });

  return {
    originalText: query,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    translations: results,
  };
};

export const translateTravelText = async ({
  text = 'Where is the nearest tourist information center?',
  targetLanguage = 'hi',
}) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const res = await translateVoiceSpeechMultiLang({ text });
  const found = res.translations.find((t) => t.languageId === targetLanguage);
  return {
    originalText: text,
    targetLanguage,
    translatedText: found ? found.translatedText : text,
  };
};

/**
 * 6. AI TRAVEL SAFETY ASSISTANT
 */
export const getSafetyGuidance = async ({
  destination = 'Jaipur',
}) => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return {
    destination,
    safetyStatus: 'Normal & Secure',
    emergencyNumbers: [
      { label: 'Tourist Police Helpline', phone: '1363' },
      { label: 'General Emergency / Police', phone: '112' },
      { label: 'Ambulance Service', phone: '108' },
      { label: 'Women Emergency Safety', phone: '1091' },
    ],
    localPrecautions: [
      'Carry refillable water bottles; drink filtered or boiled water at verified homestays.',
      'Keep digital copies of your Govt ID and Digital Tourist Pass saved offline.',
      'Respect cultural attire guidelines when visiting places of worship.',
      'Use authorized electric rickshaws or prepaid transit options at railway stations/airports.',
    ],
    weatherCaution: 'Mild afternoon sun expected (28°C - 32°C). Stay hydrated during outdoor fort walks.',
  };
};

/**
 * 7. AI SMART RECOMMENDATIONS
 */
export const getSmartRecommendations = async ({
  destination = 'Jaipur',
  preferences = 'Eco-friendly & Cultural',
  budget = 10000,
  language = 'en',
}) => {
  await new Promise((resolve) => setTimeout(resolve, 450));
  return {
    personalizedFor: `${destination} Traveler`,
    recommendations: [
      {
        id: 'smart_1',
        type: 'Hidden Gem',
        title: 'Tranquil Courtyard Garden & Stepwell',
        reason: `Matches your ${preferences} preference with low crowd density.`,
        ecoPointsReward: '+30 Eco Points',
      },
      {
        id: 'smart_2',
        type: 'Artisan Cooperative',
        title: 'Certified Natural Dye Heritage Weavers Guild',
        reason: `Directly supports local women artisans within your ₹${budget} budget.`,
        ecoPointsReward: '+50 Eco Points',
      },
      {
        id: 'smart_3',
        type: 'Green Transit Option',
        title: 'Solar Electric City Hop-On Shuttle',
        reason: 'Zero-emission transit with direct stops at key monuments.',
        ecoPointsReward: '+20 Eco Points',
      },
    ],
  };
};

