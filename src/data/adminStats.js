export const adminStatistics = {
  kpis: {
    totalTourists: '1,248,650',
    todayTourists: '14,320',
    todayGrowth: '+12.4%',
    hotelOccupancy: '78.5%',
    registeredBusinesses: '3,420',
    newBizThisMonth: '+142',
    avgTouristSpending: '₹14,800',
    overallEcoScore: '86/100',
  },
  destinationAnalytics: [
    { id: '1', name: 'Visakhapatnam Coastal Zone', visitorsToday: 6200, crowdLevel: 'moderate', capacityPercent: 68, trend: 'up' },
    { id: '2', name: 'Tirupati Temple Corridor', visitorsToday: 18400, crowdLevel: 'high', capacityPercent: 94, trend: 'up' },
    { id: '3', name: 'Araku Valley Eco-Belt', visitorsToday: 2100, crowdLevel: 'low', capacityPercent: 32, trend: 'stable' },
    { id: '4', name: 'Vijayawada Riverfront', visitorsToday: 3400, crowdLevel: 'low', capacityPercent: 41, trend: 'up' },
    { id: '5', name: 'South Goa Heritage Shores', visitorsToday: 5100, crowdLevel: 'moderate', capacityPercent: 64, trend: 'down' },
  ],
  businessAnalytics: {
    total: 3420,
    breakdown: [
      { category: 'Hotels & Eco Resorts', count: 820, percent: '24%' },
      { category: 'Homestays & Farm Stays', count: 640, percent: '19%' },
      { category: 'Local Artisans & Crafts', count: 710, percent: '21%' },
      { category: 'Restaurants & Cafes', count: 590, percent: '17%' },
      { category: 'Guides & Heritage Walkers', count: 380, percent: '11%' },
      { category: 'Eco Transport & Taxis', count: 280, percent: '8%' },
    ],
    revenueGeneratedDirectly: '₹48.6 Cr',
  },
  sustainabilityMetrics: {
    ecoHotelsCertified: 312,
    publicAndEVTransportUsagePercent: 64,
    plasticWasteReductionTons: 184,
    renewableEnergyPoweredSites: 42,
    treePlantationOffsetCount: '52,400',
  },
  touristFeedbackList: [
    {
      id: 'fb_1',
      touristName: 'Gunavarsha',
      destination: 'Visakhapatnam',
      category: 'Smart Map & Weather',
      rating: 5,
      comment: 'The rain alert accurately rescheduled our itinerary to the submarine museum! Saved our morning.',
      date: 'Today, 09:30 AM',
      status: 'resolved',
      sentiment: 'positive'
    },
    {
      id: 'fb_2',
      touristName: 'Rajesh Sharma',
      destination: 'Tirupati',
      category: 'Crowd Flow',
      rating: 4,
      comment: 'Crowd alert suggested Chandragiri Fort as an alternative. It was much calmer and beautiful.',
      date: 'Yesterday, 04:15 PM',
      status: 'acknowledged',
      sentiment: 'positive'
    },
    {
      id: 'fb_3',
      touristName: 'Deepa Krishnan',
      destination: 'Araku Valley',
      category: 'Local Artisans',
      rating: 5,
      comment: 'Purchased authentic organic coffee directly from tribal co-op via the local business marketplace!',
      date: '28 Aug, 11:00 AM',
      status: 'resolved',
      sentiment: 'positive'
    },
    {
      id: 'fb_4',
      touristName: 'Amitabh Sen',
      destination: 'Visakhapatnam',
      category: 'Public Transport',
      rating: 3,
      comment: 'EV shuttle near beach promenade needs 2 more frequency buses between 5 PM and 7 PM.',
      date: '27 Aug, 06:40 PM',
      status: 'in_review',
      sentiment: 'neutral'
    }
  ]
};
