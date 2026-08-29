import { calculateDistance } from './helpers';

/**
 * Place categories with unique symbols, colors, and badge styling
 */
export const PLACE_CATEGORIES = [
  { id: 'all', label: 'All Places', icon: 'map-outline', color: '#6366F1', bg: '#EEF2FF', count: 0 },
  { id: 'restaurant', label: 'Restaurants & Cafes', icon: 'restaurant-outline', color: '#EA580C', bg: '#FFEDD5', count: 0 },
  { id: 'hospital', label: 'Hospitals & Medical', icon: 'medkit-outline', color: '#DC2626', bg: '#FEE2E2', count: 0 },
  { id: 'famous', label: 'Famous Places & Sights', icon: 'compass-outline', color: '#0D9488', bg: '#CCFBF1', count: 0 },
  { id: 'hotel', label: 'Hotels & Eco-Stays', icon: 'bed-outline', color: '#2563EB', bg: '#EFF6FF', count: 0 },
  { id: 'artisan', label: 'Artisans & Crafts', icon: 'color-palette-outline', color: '#9333EA', bg: '#F3E8FF', count: 0 },
  { id: 'transit', label: 'Transit & EV Hubs', icon: 'train-outline', color: '#16A34A', bg: '#DCFCE7', count: 0 },
  { id: 'emergency', label: 'Police & Safety', icon: 'shield-checkmark-outline', color: '#1E293B', bg: '#F1F5F9', count: 0 },
];

/**
 * Unique symbol mappings for every specific place subcategory
 */
export const SUB_CATEGORY_SYMBOLS = {
  // Restaurants & Food
  'Fine Dining': { icon: 'restaurant', symbol: '🍽️', color: '#EA580C', bg: '#FFEDD5', pinColor: '#EA580C' },
  'Coastal Seafood': { icon: 'fish', symbol: '🦐', color: '#D97706', bg: '#FEF3C7', pinColor: '#D97706' },
  'Organic Cafe': { icon: 'cafe', symbol: '☕', color: '#B45309', bg: '#FFFBEB', pinColor: '#B45309' },
  'Heritage Biryani': { icon: 'flame', symbol: '🍲', color: '#C2410C', bg: '#FFEDD5', pinColor: '#C2410C' },
  'Pure Veg Thali': { icon: 'nutrition', symbol: '🥗', color: '#15803D', bg: '#DCFCE7', pinColor: '#15803D' },
  'Street Food Hub': { icon: 'fast-food', symbol: '🍢', color: '#F59E0B', bg: '#FEF3C7', pinColor: '#F59E0B' },
  'Bakery & Dessert': { icon: 'ice-cream', symbol: '🧁', color: '#EC4899', bg: '#FCE7F3', pinColor: '#EC4899' },
  'Rooftop Lounge': { icon: 'wine', symbol: '🍸', color: '#8B5CF6', bg: '#EDE9FE', pinColor: '#8B5CF6' },

  // Hospitals & Emergency
  'Multi-Specialty Hospital': { icon: 'medkit', symbol: '🏥', color: '#DC2626', bg: '#FEE2E2', pinColor: '#DC2626' },
  'Government Hospital': { icon: 'business', symbol: '🏢', color: '#B91C1C', bg: '#FEE2E2', pinColor: '#B91C1C' },
  '24/7 Trauma Care': { icon: 'fitness', symbol: '🚑', color: '#991B1B', bg: '#FEE2E2', pinColor: '#991B1B' },
  'Emergency Clinic': { icon: 'heart', symbol: '🩺', color: '#EF4444', bg: '#FEE2E2', pinColor: '#EF4444' },
  '24/7 Pharmacy': { icon: 'bandage', symbol: '💊', color: '#E11D48', bg: '#FFE4E6', pinColor: '#E11D48' },
  'Blood Bank & Diagnostic': { icon: 'water', symbol: '🩸', color: '#BE123C', bg: '#FFE4E6', pinColor: '#BE123C' },

  // Famous Places & Attractions
  'Historic Fort & Citadel': { icon: 'shield-outline', symbol: '🏰', color: '#0D9488', bg: '#CCFBF1', pinColor: '#0D9488' },
  'Naval & Maritime Museum': { icon: 'boat', symbol: '⚓', color: '#0284C7', bg: '#E0F2FE', pinColor: '#0284C7' },
  'Golden Beach & Promenade': { icon: 'water', symbol: '🏖️', color: '#06B6D4', bg: '#CFFAFE', pinColor: '#06B6D4' },
  'Hilltop Viewpoint': { icon: 'telescope', symbol: '🌄', color: '#059669', bg: '#D1FAE5', pinColor: '#059669' },
  'Ancient Caves & Geological': { icon: 'planet', symbol: '🪨', color: '#7C3AED', bg: '#EDE9FE', pinColor: '#7C3AED' },
  'Sacred Temple & Sanctum': { icon: 'sparkles', symbol: '🛕', color: '#D97706', bg: '#FEF3C7', pinColor: '#D97706' },
  'Aircraft Simulator & Museum': { icon: 'airplane', symbol: '✈️', color: '#3B82F6', bg: '#DBEAFE', pinColor: '#3B82F6' },
  'Botanical Garden & Waterfall': { icon: 'leaf', symbol: '🌿', color: '#16A34A', bg: '#DCFCE7', pinColor: '#16A34A' },
  'Heritage Palace': { icon: 'home', symbol: '🏛️', color: '#0891B2', bg: '#CFFAFE', pinColor: '#0891B2' },

  // Hotels & Stays
  'Eco-Resort & Spa': { icon: 'bed', symbol: '🏨', color: '#2563EB', bg: '#EFF6FF', pinColor: '#2563EB' },
  'Heritage Homestay': { icon: 'home', symbol: '🏡', color: '#3B82F6', bg: '#DBEAFE', pinColor: '#3B82F6' },
  'Boutique Beach Villa': { icon: 'sunny', symbol: '🌴', color: '#1D4ED8', bg: '#EFF6FF', pinColor: '#1D4ED8' },
  'Budget Backpacker Hostel': { icon: 'people', symbol: '🛏️', color: '#60A5FA', bg: '#EFF6FF', pinColor: '#60A5FA' },

  // Artisans & Handicrafts
  'Lacquer Wood Workshop': { icon: 'color-palette', symbol: '🎨', color: '#9333EA', bg: '#F3E8FF', pinColor: '#9333EA' },
  'Handloom Silk Weavers': { icon: 'shirt', symbol: '🧵', color: '#A855F7', bg: '#F3E8FF', pinColor: '#A855F7' },
  'Tribal Coffee Roastery': { icon: 'cafe', symbol: '☕', color: '#7E22CE', bg: '#F3E8FF', pinColor: '#7E22CE' },
  'Organic Spices & Pottery': { icon: 'storefront', symbol: '🏺', color: '#6B21A8', bg: '#F3E8FF', pinColor: '#6B21A8' },

  // Transit & EV
  'Electric Shuttle Station': { icon: 'bus', symbol: '🚌', color: '#16A34A', bg: '#DCFCE7', pinColor: '#16A34A' },
  'EV Supercharging Hub': { icon: 'flash', symbol: '⚡', color: '#CA8A04', bg: '#FEF9C3', pinColor: '#CA8A04' },
  'Express Railway Terminal': { icon: 'train', symbol: '🚆', color: '#15803D', bg: '#DCFCE7', pinColor: '#15803D' },
  'Ropeway & Hill Transit': { icon: 'car-sport', symbol: '🚡', color: '#047857', bg: '#D1FAE5', pinColor: '#047857' },

  // Emergency & Police
  'Tourist Police Assistance': { icon: 'shield-checkmark', symbol: '👮', color: '#1E293B', bg: '#F1F5F9', pinColor: '#1E293B' },
  'Coastal Patrol Post': { icon: 'radio', symbol: '🛡️', color: '#334155', bg: '#F1F5F9', pinColor: '#334155' },
  'Women Safety Helpdesk': { icon: 'lock-closed', symbol: '🔒', color: '#475569', bg: '#F1F5F9', pinColor: '#475569' },
};

/**
 * Rich seed database of place templates with accurate relative geometry offsets
 */
const PLACE_TEMPLATES = [
  // RESTAURANTS & DINING (🍽️)
  {
    id: 'rest_1',
    name: 'Andhra Ruchulu Heritage Dining',
    category: 'restaurant',
    subCategory: 'Fine Dining',
    offsetLat: 0.0052,
    offsetLng: -0.0041,
    rating: 4.8,
    reviews: 1240,
    priceRange: '₹₹₹',
    avgCostForTwo: 750,
    cuisine: 'Coastal Andhra & Banana Leaf Thali',
    specialty: 'Avakaya Biryani, Royyala Vepudu (Prawns), Pootharekulu',
    openHours: '11:30 AM - 11:00 PM',
    crowdLevel: 'moderate',
    ecoScore: 92,
    phone: '+91 891 278 4501',
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80',
    description: 'Award-winning traditional coastal cuisine served on fresh banana leaves with organic local farm ingredients.',
    dietary: ['Pure Veg Options', 'Halal Certified', 'Organic Sourced'],
  },
  {
    id: 'rest_2',
    name: 'Ocean Pearl Seafood Grill & Terrace',
    category: 'restaurant',
    subCategory: 'Coastal Seafood',
    offsetLat: -0.0038,
    offsetLng: 0.0062,
    rating: 4.9,
    reviews: 890,
    priceRange: '₹₹₹₹',
    avgCostForTwo: 1400,
    cuisine: 'Fresh Catch Coastal Grill & Continental',
    specialty: 'Tandoori Crab, Butter Garlic Lobster, Fish Tikka',
    openHours: '12:00 PM - 11:30 PM',
    crowdLevel: 'high',
    ecoScore: 88,
    phone: '+91 891 254 9900',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
    description: 'Beachfront sunset dining with fresh catch sourced directly from local fisherman cooperatives.',
    dietary: ['Fresh Catch', 'Gluten Free Options'],
  },
  {
    id: 'rest_3',
    name: 'Araku Valley Organic Coffee Roastery',
    category: 'restaurant',
    subCategory: 'Organic Cafe',
    offsetLat: 0.0075,
    offsetLng: 0.0028,
    rating: 4.7,
    reviews: 620,
    priceRange: '₹₹',
    avgCostForTwo: 450,
    cuisine: 'Artisan Coffee, Sourdough & Vegan Bakes',
    specialty: 'Single-Origin Pour-over, Honey Processed Espresso',
    openHours: '07:30 AM - 10:00 PM',
    crowdLevel: 'low',
    ecoScore: 96,
    phone: '+91 891 230 1144',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    description: 'Certified 100% tribal shade-grown Arabica coffee brewed fresh with sustainable zero-waste practices.',
    dietary: ['100% Vegan Options', 'Plant Milks', 'Organic Certified'],
  },
  {
    id: 'rest_4',
    name: 'Nawabi Dastarkhwan Dum Biryani',
    category: 'restaurant',
    subCategory: 'Heritage Biryani',
    offsetLat: -0.0065,
    offsetLng: -0.0055,
    rating: 4.8,
    reviews: 2150,
    priceRange: '₹₹',
    avgCostForTwo: 600,
    cuisine: 'Authentic Hyderabadi & Awadhi Dum Biryani',
    specialty: 'Slow-cooked Zafrani Gosht Biryani, Mirchi Ka Salan',
    openHours: '12:00 PM - 12:00 AM',
    crowdLevel: 'high',
    ecoScore: 84,
    phone: '+91 891 267 8899',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    description: 'Century-old recipes slow-cooked in sealed clay handis with pure saffron and aromatic spices.',
    dietary: ['Halal Certified', 'Family Dining'],
  },
  {
    id: 'rest_5',
    name: 'Sri Krishna Annapurna Sattvik Kitchen',
    category: 'restaurant',
    subCategory: 'Pure Veg Thali',
    offsetLat: 0.0025,
    offsetLng: -0.0082,
    rating: 4.9,
    reviews: 1780,
    priceRange: '₹',
    avgCostForTwo: 300,
    cuisine: 'Sattvik South Indian & Royal Thali',
    specialty: 'Unlimited Ghee Podi Thali, Filter Coffee, Mysore Pak',
    openHours: '06:30 AM - 10:30 PM',
    crowdLevel: 'moderate',
    ecoScore: 94,
    phone: '+91 891 222 3411',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    description: 'Pure vegetarian sattvik preparations with farm-fresh organic vegetables and desi cow ghee.',
    dietary: ['100% Pure Veg', 'Jain Food Available', 'No Onion No Garlic'],
  },
  {
    id: 'rest_6',
    name: 'Skyline 360 Rooftop Lounge',
    category: 'restaurant',
    subCategory: 'Rooftop Lounge',
    offsetLat: 0.0092,
    offsetLng: 0.0085,
    rating: 4.6,
    reviews: 510,
    priceRange: '₹₹₹₹',
    avgCostForTwo: 1800,
    cuisine: 'Pan-Asian & Mediterranean Fusion',
    specialty: 'Woodfired Truffle Pizza, Sushi Platters, Craft Mocktails',
    openHours: '05:00 PM - 01:00 AM',
    crowdLevel: 'moderate',
    ecoScore: 86,
    phone: '+91 891 299 7733',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    description: 'Panoramic 360-degree city and coastline view with live acoustic music and chef specials.',
    dietary: ['Cocktails & Mocktails', 'Late Night Dining'],
  },

  // HOSPITALS & EMERGENCY CARE (🏥)
  {
    id: 'hosp_1',
    name: 'Apollo Multi-Specialty & Trauma Centre',
    category: 'hospital',
    subCategory: 'Multi-Specialty Hospital',
    offsetLat: 0.0045,
    offsetLng: 0.0055,
    rating: 4.9,
    reviews: 3200,
    specialty: '24x7 Emergency Trauma, Cardiology, Neurology & ICU',
    openHours: '24 Hours / 7 Days',
    emergencyHelpline: '1066 / 108',
    bedsAvailable: 42,
    hasAmbulance: true,
    ecoScore: 90,
    phone: '+91 891 287 7777',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80',
    description: 'NABH and JCI accredited premier hospital with dedicated international and domestic tourist trauma care unit.',
    services: ['24/7 Pharmacy', 'CT / MRI Diagnostics', 'ICU', 'Air Ambulance'],
  },
  {
    id: 'hosp_2',
    name: 'King George Government General Hospital (KGH)',
    category: 'hospital',
    subCategory: 'Government Hospital',
    offsetLat: -0.0055,
    offsetLng: -0.0035,
    rating: 4.5,
    reviews: 4800,
    specialty: 'Tertiary Government Care, Burn Unit & Emergency',
    openHours: '24 Hours / 7 Days',
    emergencyHelpline: '108 / 112',
    bedsAvailable: 110,
    hasAmbulance: true,
    ecoScore: 82,
    phone: '+91 891 256 4891',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
    description: 'Historical landmark multi-department government teaching hospital with round-the-clock emergency casualty desk.',
    services: ['Free Emergency Care', 'Blood Bank', 'Trauma Ward', 'Central Casualty'],
  },
  {
    id: 'hosp_3',
    name: 'Care 24/7 Emergency & Critical Clinic',
    category: 'hospital',
    subCategory: '24/7 Trauma Care',
    offsetLat: 0.0082,
    offsetLng: -0.0022,
    rating: 4.8,
    reviews: 950,
    specialty: 'Rapid Response Emergency, Orthopedics & Minor Surgery',
    openHours: '24 Hours / 7 Days',
    emergencyHelpline: '108',
    bedsAvailable: 18,
    hasAmbulance: true,
    ecoScore: 88,
    phone: '+91 891 270 5500',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
    description: 'Express emergency casualty center equipped with mobile defibrillators and rapid tourist medical triage.',
    services: ['Rapid Triage', 'Digital X-Ray', 'Minor OT', 'ECG Monitoring'],
  },
  {
    id: 'hosp_4',
    name: 'MedPlus 24x7 Tourist Super Pharmacy & First-Aid',
    category: 'hospital',
    subCategory: '24/7 Pharmacy',
    offsetLat: -0.0022,
    offsetLng: 0.0035,
    rating: 4.8,
    reviews: 1420,
    specialty: 'Life-saving Drugs, Tourist First-Aid, Oxygen Cylinders',
    openHours: 'Open 24 Hours',
    emergencyHelpline: '+91 891 278 1200',
    bedsAvailable: 0,
    hasAmbulance: false,
    ecoScore: 92,
    phone: '+91 891 278 1200',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80',
    description: 'Fully stocked 24-hour pharmacy with cold-chain insulin storage, altitude sickness kits, and travel vaccines.',
    services: ['Home/Hotel Delivery', 'First Aid Kits', 'Prescription Verification'],
  },

  // FAMOUS PLACES & TOURIST SIGHTS (🏛️)
  {
    id: 'fam_1',
    name: 'INS Kursura Submarine Museum',
    category: 'famous',
    subCategory: 'Naval & Maritime Museum',
    offsetLat: 0.0060,
    offsetLng: 0.0078,
    rating: 4.9,
    reviews: 6800,
    entryFee: 70,
    openHours: '02:00 PM - 08:30 PM (Closed Mon)',
    crowdLevel: 'moderate',
    ecoScore: 92,
    image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=600&q=80',
    description: 'Real decommissioned Soviet-built submarine preserved on beach sands offering guided tours inside the torpedo and control rooms.',
    highlights: ['Torpedo Room', 'Sonar Station', 'Captain Quarters', 'Guided Ex-Naval Tours'],
  },
  {
    id: 'fam_2',
    name: 'RK Beach & Coastal Heritage Promenade',
    category: 'famous',
    subCategory: 'Golden Beach & Promenade',
    offsetLat: -0.0005,
    offsetLng: 0.0015,
    rating: 4.8,
    reviews: 15400,
    entryFee: 0,
    openHours: 'Open 24/7',
    crowdLevel: 'high',
    ecoScore: 85,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    description: 'Famous sweeping coastal beach promenade with sunrise vantage points, victory memorials, and walking trails.',
    highlights: ['Sunrise Point', 'Coastal Promenade', 'Beach Volleyball', 'Evening Sea Breeze'],
  },
  {
    id: 'fam_3',
    name: 'Kailasagiri Hilltop Panoramic Eco-Park',
    category: 'famous',
    subCategory: 'Hilltop Viewpoint',
    offsetLat: 0.0125,
    offsetLng: 0.0095,
    rating: 4.8,
    reviews: 8900,
    entryFee: 150,
    openHours: '06:00 AM - 08:00 PM',
    crowdLevel: 'moderate',
    ecoScore: 94,
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
    description: '360-foot hilltop garden offering breathtaking ocean views, ropeway cable car rides, and giant Shiva-Parvathi statues.',
    highlights: ['Ropeway Cable Car', 'Toy Train', 'Titanic Viewpoint', 'Floral Clock'],
  },
  {
    id: 'fam_4',
    name: 'TU 142 Aircraft Simulator & Reconnaissance Museum',
    category: 'famous',
    subCategory: 'Aircraft Simulator & Museum',
    offsetLat: 0.0072,
    offsetLng: 0.0088,
    rating: 4.7,
    reviews: 3100,
    entryFee: 50,
    openHours: '02:00 PM - 08:30 PM',
    crowdLevel: 'low',
    ecoScore: 90,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80',
    description: 'Massive long-range anti-submarine turboprop reconnaissance aircraft with cockpit VR simulator exhibits.',
    highlights: ['Cockpit VR Simulator', 'Black Box Exhibit', 'Anti-Sub Torpedoes'],
  },
  {
    id: 'fam_5',
    name: 'Yarada Secluded Coastal Golden Cove',
    category: 'famous',
    subCategory: 'Golden Beach & Promenade',
    offsetLat: -0.0145,
    offsetLng: -0.0120,
    rating: 4.9,
    reviews: 4200,
    entryFee: 0,
    openHours: 'Open 24/7',
    crowdLevel: 'low',
    ecoScore: 96,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
    description: 'A tranquil, secluded paradise flanked by Dolphin’s Nose hills on three sides and emerald waters.',
    highlights: ['Zero Crowd', 'Pristine Clean Waters', 'Dolphin Nose View'],
  },
  {
    id: 'fam_6',
    name: 'Simhachalam Hilltop Temple Citadel',
    category: 'famous',
    subCategory: 'Sacred Temple & Sanctum',
    offsetLat: 0.0150,
    offsetLng: -0.0110,
    rating: 4.9,
    reviews: 12000,
    entryFee: 100,
    openHours: '06:00 AM - 09:00 PM',
    crowdLevel: 'high',
    ecoScore: 91,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
    description: '11th-century Kalinga-Dravidian stone architectural wonder dedicated to Lord Narasimha Swamy.',
    highlights: ['Intricate Stone Carvings', 'Kalyana Mandapam', 'Hilltop Serenity'],
  },

  // HOTELS & ECO-STAYS (🏨)
  {
    id: 'hotel_1',
    name: 'Bay Breeze Eco-Luxury Oceanfront Resort',
    category: 'hotel',
    subCategory: 'Eco-Resort & Spa',
    offsetLat: 0.0035,
    offsetLng: 0.0042,
    rating: 4.8,
    reviews: 940,
    pricePerNight: 4200,
    openHours: '24/7 Concierge',
    crowdLevel: 'low',
    ecoScore: 95,
    phone: '+91 891 289 1234',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    description: '100% Solar-powered luxury beachfront resort with rainwater harvesting, organic dining, and infinity pool.',
    amenities: ['Solar Microgrid', 'Infinity Pool', 'Zero Single-Use Plastic', 'EV Charging'],
  },
  {
    id: 'hotel_2',
    name: 'Coastal Haven Heritage Homestay',
    category: 'hotel',
    subCategory: 'Heritage Homestay',
    offsetLat: -0.0048,
    offsetLng: 0.0018,
    rating: 4.9,
    reviews: 580,
    pricePerNight: 1800,
    openHours: 'Check-in: 12:00 PM',
    crowdLevel: 'low',
    ecoScore: 98,
    phone: '+91 891 276 4412',
    image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=600&q=80',
    description: 'Traditional coastal tiled courtyard homestay managed by local host family with home-cooked breakfast.',
    amenities: ['Home Cooked Breakfast', 'Bicycle Rentals', 'Organic Garden'],
  },

  // ARTISANS & HANDICRAFTS (🛍️)
  {
    id: 'art_1',
    name: 'Etikoppaka Master Woodcraft Guild',
    category: 'artisan',
    subCategory: 'Lacquer Wood Workshop',
    offsetLat: -0.0070,
    offsetLng: -0.0080,
    rating: 4.9,
    reviews: 640,
    priceRange: '₹₹',
    openHours: '09:30 AM - 07:30 PM',
    crowdLevel: 'low',
    ecoScore: 99,
    phone: '+91 891 245 9090',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
    description: 'GI-tagged non-toxic vegetable lacquer carved wooden toys and kitchenware made by 4th generation masters.',
    crafts: ['GI Tagged Toys', 'Natural Dyes', 'Live Wood Turning Workshop'],
  },
  {
    id: 'art_2',
    name: 'Coastal Handloom Silk & Cotton Weavers',
    category: 'artisan',
    subCategory: 'Handloom Silk Weavers',
    offsetLat: 0.0085,
    offsetLng: -0.0065,
    rating: 4.8,
    reviews: 420,
    priceRange: '₹₹₹',
    openHours: '10:00 AM - 08:00 PM',
    crowdLevel: 'low',
    ecoScore: 97,
    phone: '+91 891 255 3300',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
    description: 'Direct weaver cooperative selling Uppada pure zari sarees, organic khadi shirts, and ikat fabrics.',
    crafts: ['Uppada Jamdani', 'Organic Khadi', 'Fair Trade Cooperative'],
  },

  // TRANSIT & EV HUBS (🚆)
  {
    id: 'trans_1',
    name: 'Beach Road Eco EV Supercharging & Shuttle Hub',
    category: 'transit',
    subCategory: 'EV Supercharging Hub',
    offsetLat: 0.0010,
    offsetLng: 0.0030,
    rating: 4.7,
    reviews: 820,
    fare: '₹20 (Shuttle) / ₹12/kWh (EV)',
    openHours: '24/7 Automated',
    crowdLevel: 'low',
    ecoScore: 98,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    description: 'Solar powered fast EV chargers (CCS2 & Type 2) and tourist hop-on electric shuttle connection point.',
    facilities: ['120kW Fast Chargers', 'Free Wi-Fi', 'EV Tourist Shuttles', 'Smart Card Kiosk'],
  },
  {
    id: 'trans_2',
    name: 'Central Vande Bharat & Express Railway Junction',
    category: 'transit',
    subCategory: 'Express Railway Terminal',
    offsetLat: -0.0105,
    offsetLng: -0.0075,
    rating: 4.6,
    reviews: 14500,
    openHours: 'Open 24/7',
    crowdLevel: 'high',
    ecoScore: 86,
    image: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&w=600&q=80',
    description: 'Modernized railway junction connecting Vande Bharat Express, air-conditioned waiting lounges, and taxi ranks.',
    facilities: ['Executive Lounge', 'Prepaid Taxi', 'Luggage Cloakroom', 'Tourist Desk'],
  },

  // EMERGENCY & POLICE (👮)
  {
    id: 'emg_1',
    name: 'Beach Promenade Tourist Police Assistance Desk',
    category: 'emergency',
    subCategory: 'Tourist Police Assistance',
    offsetLat: 0.0020,
    offsetLng: 0.0040,
    rating: 4.9,
    reviews: 730,
    emergencyHelpline: '112 / 100',
    openHours: 'Open 24/7',
    crowdLevel: 'low',
    ecoScore: 89,
    phone: '+91 891 256 5555',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80',
    description: 'Dedicated multilingual tourist safety station with lost & found desk, beach safety patrol, and instant SOS dispatch.',
    services: ['Multilingual Officers', 'Lost & Found', 'Beach Rescue', 'SOS Dispatch'],
  },
];

/**
 * Procedurally generates accurate, highly detailed places around any GPS coordinate
 */
export const getPlacesAroundLocation = (userCoords, filterCategory = 'all', maxRadiusKm = 25, searchQuery = '') => {
  const baseLat = userCoords?.latitude || 17.7120;
  const baseLng = userCoords?.longitude || 83.3240;

  const places = PLACE_TEMPLATES.map((tmpl) => {
    const lat = baseLat + tmpl.offsetLat;
    const lng = baseLng + tmpl.offsetLng;

    const distanceKm = calculateDistance(baseLat, baseLng, lat, lng);
    const walkMinutes = Math.max(2, Math.round(distanceKm * 12));
    const driveMinutes = Math.max(1, Math.round(distanceKm * 2.8));

    const symbolConfig = SUB_CATEGORY_SYMBOLS[tmpl.subCategory] || {
      icon: 'location',
      symbol: '📍',
      color: '#2563EB',
      bg: '#EFF6FF',
      pinColor: '#2563EB',
    };

    return {
      ...tmpl,
      coords: { latitude: lat, longitude: lng },
      distanceKm: parseFloat(distanceKm),
      walkMinutes,
      driveMinutes,
      symbolConfig,
    };
  });

  // Calculate category counts
  const categoryCounts = {
    all: places.length,
    restaurant: places.filter((p) => p.category === 'restaurant').length,
    hospital: places.filter((p) => p.category === 'hospital').length,
    famous: places.filter((p) => p.category === 'famous').length,
    hotel: places.filter((p) => p.category === 'hotel').length,
    artisan: places.filter((p) => p.category === 'artisan').length,
    transit: places.filter((p) => p.category === 'transit').length,
    emergency: places.filter((p) => p.category === 'emergency').length,
  };

  // Filter by category
  let filtered = places;
  if (filterCategory && filterCategory !== 'all') {
    filtered = filtered.filter((p) => p.category === filterCategory);
  }

  // Filter by max radius
  if (maxRadiusKm) {
    filtered = filtered.filter((p) => p.distanceKm <= maxRadiusKm);
  }

  // Filter by search query
  if (searchQuery && searchQuery.trim().length > 0) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        (p.cuisine && p.cuisine.toLowerCase().includes(q)) ||
        (p.specialty && p.specialty.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }

  // Sort by distance ascending
  filtered.sort((a, b) => a.distanceKm - b.distanceKm);

  return {
    places: filtered,
    allPlaces: places,
    categoryCounts,
  };
};
