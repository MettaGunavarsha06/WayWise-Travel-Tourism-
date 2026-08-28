import { destinations } from '../data/destinations';
import { hotels } from '../data/hotels';
import { transportModes } from '../data/transport';
import { generateTripId } from './helpers';

export const generateAIItinerary = ({
  destinationId = 'dest_vizag',
  destinationName = 'Visakhapatnam',
  days = 4,
  travelers = 2,
  totalBudget = 15000,
  interests = ['Nature', 'History', 'Beaches'],
  travelPreference = 'Comfortable', // Cheapest | Fastest | Comfortable | Eco-friendly
}) => {
  const dest = destinations.find((d) => d.id === destinationId) || destinations[0];
  const numDays = Math.max(1, Math.min(Number(days) || 4, 7));
  const numTravelers = Math.max(1, Number(travelers) || 2);
  const budget = Number(totalBudget) || 15000;

  // Select appropriate hotel based on preference
  const destHotels = hotels.filter((h) => h.destinationId === dest.id);
  let selectedHotel = destHotels[0] || hotels[0];
  if (travelPreference === 'Cheapest') {
    selectedHotel = destHotels.reduce((prev, curr) => (prev.pricePerNight < curr.pricePerNight ? prev : curr), destHotels[0] || hotels[0]);
  } else if (travelPreference === 'Eco-friendly') {
    selectedHotel = destHotels.reduce((prev, curr) => (prev.sustainabilityScore > curr.sustainabilityScore ? prev : curr), destHotels[0] || hotels[0]);
  }

  // Select transport based on preference
  let selectedTransport = transportModes.find((t) => t.id === 'train') || transportModes[0];
  if (travelPreference === 'Cheapest') {
    selectedTransport = transportModes.find((t) => t.id === 'bus') || transportModes[1];
  } else if (travelPreference === 'Fastest') {
    selectedTransport = transportModes.find((t) => t.id === 'taxi') || transportModes[2];
  } else if (travelPreference === 'Eco-friendly') {
    selectedTransport = transportModes.find((t) => t.id === 'train') || transportModes[0];
  }

  // Generate dynamic day-by-day activities
  const itineraryDays = [];
  const allAttractions = dest.attractions || [];

  for (let i = 1; i <= numDays; i++) {
    let dayTitle = `Day ${i}: Exploring ${dest.name}`;
    let activities = [];

    if (i === 1) {
      dayTitle = `Day 1: Arrival & Coastal Welcome`;
      activities = [
        { time: '09:30 AM', title: 'Hotel Check-in & Freshen Up', venue: selectedHotel.name, type: 'indoor', cost: 0, isWeatherSafe: true },
        { time: '11:30 AM', title: allAttractions[0]?.name || 'Scenic City Walk', venue: dest.name, type: allAttractions[0]?.type || 'outdoor', cost: allAttractions[0]?.cost || 0, isWeatherSafe: allAttractions[0]?.type === 'indoor' },
        { time: '01:30 PM', title: 'Authentic Andhra Lunch at Local Banana-Leaf Mess', venue: 'Central Dining', type: 'indoor', cost: 350, isWeatherSafe: true },
        { time: '04:00 PM', title: allAttractions[1]?.name || 'INS Kursura Submarine Museum', venue: dest.name, type: allAttractions[1]?.type || 'indoor', cost: allAttractions[1]?.cost || 70, isWeatherSafe: true },
        { time: '07:30 PM', title: 'Sunset Promenade & Street Food Tasting', venue: 'Beachside', type: 'outdoor', cost: 200, isWeatherSafe: false }
      ];
    } else if (i === 2) {
      dayTitle = `Day 2: Hilltops & Cultural Heritage`;
      activities = [
        { time: '08:30 AM', title: allAttractions[2]?.name || 'Kailasagiri Hilltop Park', venue: 'Hilltop', type: 'outdoor', cost: 150, isWeatherSafe: false },
        { time: '12:00 PM', title: allAttractions[3]?.name || 'TU 142 Aircraft Museum', venue: 'Beach Road', type: 'indoor', cost: 50, isWeatherSafe: true },
        { time: '02:00 PM', title: 'Traditional Seafood & Thali Lunch', venue: 'Local Bistro', type: 'indoor', cost: 400, isWeatherSafe: true },
        { time: '04:30 PM', title: 'Local Handicrafts & Wooden Toy Workshop', venue: 'Artisan Hub', type: 'indoor', cost: 150, isWeatherSafe: true }
      ];
    } else if (i === 3) {
      dayTitle = `Day 3: Nature Wonders & Caves`;
      activities = [
        { time: '08:00 AM', title: 'Scenic Hill Rail or Valley Journey', venue: 'Valley Route', type: 'outdoor', cost: 200, isWeatherSafe: true },
        { time: '11:00 AM', title: 'Borra Limestone Caves & Geological Formations', venue: 'Caves', type: 'indoor', cost: 110, isWeatherSafe: true },
        { time: '01:30 PM', title: 'Organic Coffee Estate Tour & Bamboo Chicken Lunch', venue: 'Coffee Plantation', type: 'outdoor', cost: 450, isWeatherSafe: false },
        { time: '05:00 PM', title: 'Tribal Dance & Folk Music Experience', venue: 'Cultural Center', type: 'indoor', cost: 200, isWeatherSafe: true }
      ];
    } else {
      dayTitle = `Day ${i}: Temple Sanctum & Departure`;
      activities = [
        { time: '08:30 AM', title: allAttractions[4]?.name || 'Simhachalam Temple Visit', venue: 'Temple Hill', type: 'outdoor', cost: 100, isWeatherSafe: false },
        { time: '12:30 PM', title: 'Souvenir & Spices Shopping at Local Artisan Marketplace', venue: 'Market', type: 'indoor', cost: 500, isWeatherSafe: true },
        { time: '03:30 PM', title: 'Hotel Checkout & Return Journey Transit', venue: selectedTransport.name, type: 'indoor', cost: 0, isWeatherSafe: true }
      ];
    }

    itineraryDays.push({
      dayNumber: i,
      title: dayTitle,
      activities,
      isWeatherAdjusted: false,
    });
  }

  // Calculate estimated budget breakdown
  const hotelTotalCost = selectedHotel.pricePerNight * (numDays - 1 > 0 ? numDays - 1 : 1);
  const transportTotalCost = selectedTransport.cost * numTravelers * 2; // return journey + local
  const foodTotalCost = 600 * numTravelers * numDays;
  const activitiesTotalCost = 500 * numTravelers * numDays;
  const shoppingTotalCost = 1000;
  const otherTotalCost = 500;

  const totalEstimatedCost = hotelTotalCost + transportTotalCost + foodTotalCost + activitiesTotalCost + shoppingTotalCost + otherTotalCost;
  const isOverBudget = totalEstimatedCost > budget;
  const deficit = isOverBudget ? totalEstimatedCost - budget : 0;
  const remaining = !isOverBudget ? budget - totalEstimatedCost : 0;

  return {
    id: generateTripId(),
    destinationId: dest.id,
    destinationName: dest.name,
    state: dest.state,
    bannerImage: dest.banner || dest.image,
    days: numDays,
    travelers: numTravelers,
    userBudget: budget,
    travelPreference,
    interests,
    hotel: selectedHotel,
    transport: selectedTransport,
    ecoScore: Math.round((dest.ecoScore + selectedHotel.sustainabilityScore + selectedTransport.ecoScore) / 3),
    budgetBreakdown: {
      hotel: hotelTotalCost,
      transport: transportTotalCost,
      food: foodTotalCost,
      activities: activitiesTotalCost,
      shopping: shoppingTotalCost,
      other: otherTotalCost,
      total: totalEstimatedCost,
      userBudget: budget,
      isOverBudget,
      deficit,
      remaining,
      isOptimized: false,
    },
    daysPlan: itineraryDays,
    weatherAlert: 'Rain is expected tomorrow. Swap outdoor to indoor attractions.',
    crowdAlert: dest.crowdLevel === 'high' ? 'High crowd detected at peak spots. Tap to view less-crowded alternatives.' : null,
    createdAt: new Date().toISOString(),
  };
};

export const applyWeatherSwap = (trip) => {
  if (!trip || !trip.daysPlan) return trip;
  
  const updatedDays = trip.daysPlan.map((day) => {
    // If it's Day 2 (or any day affected by rain)
    if (day.dayNumber === 2 || day.dayNumber === 1) {
      const swappedActivities = day.activities.map((act) => {
        if (act.type === 'outdoor' && !act.isWeatherSafe) {
          if (act.title.includes('Kailasagiri') || act.title.includes('Hilltop') || act.title.includes('Beach')) {
            return {
              ...act,
              title: 'INS Kursura Submarine & TU 142 Aircraft Simulator (Indoor Museum)',
              venue: 'Air-Conditioned Coastal Museum Complex',
              type: 'indoor',
              isWeatherSafe: true,
              swappedNote: 'Swapped from Outdoor Hilltop due to forecasted rain 🌧️',
            };
          }
          if (act.title.includes('Estate') || act.title.includes('Plantation') || act.title.includes('Promenade')) {
            return {
              ...act,
              title: 'Visakha Heritage Art Gallery & Artisans Weaving Pavilion',
              venue: 'Heritage Indoor Pavilion',
              type: 'indoor',
              isWeatherSafe: true,
              swappedNote: 'Swapped from Outdoor Walk due to rain alert 🌧️',
            };
          }
        }
        return act;
      });

      return {
        ...day,
        title: `${day.title} (Weather-Protected ☔)`,
        activities: swappedActivities,
        isWeatherAdjusted: true,
      };
    }
    return day;
  });

  return {
    ...trip,
    daysPlan: updatedDays,
    weatherAlert: '✅ Weather adjustment applied: Outdoor attractions rescheduled to protected indoor experiences.',
  };
};
