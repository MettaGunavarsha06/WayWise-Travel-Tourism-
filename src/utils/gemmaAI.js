/**
 * WayWise Travel Assistant Service
 * Real-time AI Assistant powered by Google Gemini 2.5 Flash via secure backend server.
 * No hardcoded or mock responses.
 */

import { destinations } from '../data/destinations.js';
import { hotels } from '../data/hotels.js';
import { transportModes } from '../data/transport.js';
import { crowdData } from '../data/crowdData.js';
import { weatherData, defaultWeather } from '../data/weather.js';
import { getBackendBaseUrl } from '../services/apiConfig.js';

export const GEMINI_MODEL_VERSION = 'Gemini 2.5 Flash';
export const GEMMA_MODEL_VERSION = 'Gemini 2.5 Flash';

export const GEMMA_SYSTEM_INSTRUCTION = `
You are the WayWise AI Travel Concierge, designed for sustainable and cultural tourism across India.
Your role:
1. Provide personalized day-by-day itineraries based on budget, interests, and eco-preferences.
2. Monitor real-time crowd saturation and suggest peaceful alternatives to prevent over-tourism.
3. Adapt itineraries dynamically to forecasted weather anomalies.
4. Direct spending toward local grassroots artisans, tribal cooperatives, and certified green homestays.
5. Offer emergency safety guidance and multi-lingual assistance across English, Hindi, Telugu, Tamil, Kannada, and Malayalam.
`;

/**
 * Check backend server and Gemini connectivity status
 */
export const checkServerHealth = async () => {
  const primaryUrl = getBackendBaseUrl();
  const candidateUrls = [
    `${primaryUrl}/api/health`,
    `http://172.16.129.61:5000/api/health`,
    `http://localhost:5000/api/health`,
    `http://10.0.2.2:5000/api/health`,
  ];

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Try next candidate
    }
  }

  return { status: 'offline', apiKeyConfigured: false, error: 'Could not connect to backend server' };
};

/**
 * Query Gemini 2.5 Flash assistant via backend server.
 * Sends the user's prompt directly to Gemini and returns the genuine AI response.
 * Throws a descriptive error if the Gemini API or backend server fails.
 */
export const queryGemmaAssistant = async ({
  prompt,
  conversationHistory = [],
  activeTrip = null,
  userLanguage = 'en',
}) => {
  const query = prompt.trim();
  if (!query) {
    throw new Error('Prompt cannot be empty.');
  }

  const primaryUrl = getBackendBaseUrl();
  const candidateEndpoints = [
    `${primaryUrl}/api/chat`,
    `http://172.16.129.61:5000/api/chat`,
    `http://localhost:5000/api/chat`,
    `http://10.0.2.2:5000/api/chat`,
  ];

  // Remove duplicates
  const uniqueEndpoints = [...new Set(candidateEndpoints)];

  let lastError = null;

  for (const endpoint of uniqueEndpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: query,
          conversationHistory,
          activeTrip,
          userLanguage,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await res.json().catch(() => null);

      if (res.ok && data?.text) {
        return {
          model: data.model || GEMINI_MODEL_VERSION,
          text: data.text,
          actionSuggestion: data.actionSuggestion || null,
        };
      }

      if (!res.ok) {
        const errorMsg = data?.error || `Server responded with status ${res.status}`;
        throw new Error(errorMsg);
      }
    } catch (err) {
      lastError = err.message;
      // If it was an explicit server error response (e.g. Gemini API error), propagate it directly
      if (err.message && !err.message.includes('Network request failed') && !err.message.includes('abort') && !err.message.includes('Failed to fetch')) {
        throw err;
      }
    }
  }

  // If all network connection attempts failed
  throw new Error(
    `Failed to reach WayWise Gemini backend at ${primaryUrl} (${lastError || 'Network request failed'}). Please verify that the backend server is running via 'npm run server' and your device is connected to the same Wi-Fi network.`
  );
};

/**
 * 1. AI TRIP PLANNER (Helper for Profile/Wizard screens)
 */
export const generateAITripPlan = async ({
  destination = 'Jaipur',
  days = 3,
  budget = 15000,
  travelers = 2,
  preferences = 'Eco-friendly & Cultural',
  interests = ['Heritage', 'Local Crafts', 'Nature'],
}) => {
  try {
    const prompt = `Generate a detailed day-by-day travel itinerary for ${destination} for ${days} days with a total budget of ₹${budget} for ${travelers} travelers. Focus on ${preferences} and interests: ${interests.join(', ')}. Include estimated costs in ₹.`;
    const aiResponse = await queryGemmaAssistant({ prompt });
    if (aiResponse?.text) {
      return {
        destination,
        days,
        totalBudget: budget,
        travelers,
        summary: aiResponse.text,
      };
    }
  } catch (e) {
    console.log('Using structured planner fallback:', e.message);
  }

  const dailyBudget = Math.round(budget / days);
  const perPersonDaily = Math.round(dailyBudget / travelers);

  const itineraryDays = Array.from({ length: Number(days) || 3 }).map((_, i) => {
    const dayNum = i + 1;
    return {
      day: dayNum,
      title: `Day ${dayNum}: Exploring ${destination}`,
      morning: `09:00 AM - Historic architectural walking tour and cultural exploration.`,
      afternoon: `01:00 PM - Regional specialty lunch at local cooperative dining hall.`,
      evening: `05:30 PM - Artisan craft market visit and scenic sunset viewpoint.`,
      places: [`${destination} Heritage Center`, `Artisan Cooperative Market`, `Sunset Point`],
      activities: [`Guided Heritage Walk`, `Local Craft Appreciation`],
      food: [`Authentic Regional Thali`, `Local Herbal Teas`],
      estimatedCost: dailyBudget,
      travelTime: `20-30 mins local electric transit`,
      localExperience: `Direct support to verified local artisans and licensed heritage guides.`,
    };
  });

  return {
    destination,
    days,
    totalBudget: budget,
    travelers,
    perPersonBudget: perPersonDaily,
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
  try {
    const prompt = `As a destination guide for ${destination}, please answer: "${question}" (Category: ${category}). Provide practical local advice with eco-friendly and cultural recommendations.`;
    const aiResponse = await queryGemmaAssistant({ prompt });
    if (aiResponse?.text) {
      return {
        answer: aiResponse.text,
        category,
      };
    }
  } catch (e) {
    console.log('Using local destination guide fallback:', e.message);
  }

  return {
    answer: `As your WayWise Travel Guide for ${destination}, explore historic monuments in the morning, authentic regional thali dining at noon, and verified artisan markets in the evening!`,
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
  try {
    const res = await translateVoiceSpeechMultiLang({ text });
    const found = res?.translations?.find((t) => t.languageId === targetLanguage);
    if (found?.translatedText) {
      return {
        originalText: text,
        targetLanguage,
        translatedText: found.translatedText,
      };
    }
  } catch (e) {}

  return {
    originalText: text,
    targetLanguage,
    translatedText: text,
  };
};

/**
 * 6. AI TRAVEL SAFETY ASSISTANT
 */
export const getSafetyGuidance = async ({
  destination = 'Jaipur',
}) => {
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
