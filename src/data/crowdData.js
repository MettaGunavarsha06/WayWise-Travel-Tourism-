export const crowdData = {
  'dest_vizag': {
    overallCrowdLevel: 'moderate',
    densityPercent: 62,
    peakHours: '4:30 PM - 8:00 PM',
    liveSpots: [
      {
        id: 'spot_v1',
        name: 'RK Beach Promenade',
        level: 'high', // high | moderate | low
        percent: 88,
        status: 'Peak Rush Expected',
        alternatives: [
          { name: 'Yarada Beach', distance: '12 km', crowd: 'low', reason: 'Secluded golden bay surrounded by dolphin hills with 75% fewer visitors.' },
          { name: 'Bheemili Heritage Coastline', distance: '24 km', crowd: 'low', reason: 'Old Dutch settlement beach with serene coconut trails.' },
          { name: 'Tenneti Coastal Park', distance: '6 km', crowd: 'moderate', reason: 'Cliffside sea viewpoint with lush green terrace seats.' }
        ]
      },
      {
        id: 'spot_v2',
        name: 'INS Kursura Submarine',
        level: 'moderate',
        percent: 54,
        status: 'Normal Queue (10 min wait)',
        alternatives: []
      },
      {
        id: 'spot_v3',
        name: 'Kailasagiri Ropeway',
        level: 'high',
        percent: 82,
        status: 'Ropeway queue > 25 mins',
        alternatives: [
          { name: 'Ross Hill Viewpoint', distance: '8 km', crowd: 'low', reason: 'Panoramic views of ship harbor and city skyline without wait times.' }
        ]
      }
    ]
  },
  'dest_araku': {
    overallCrowdLevel: 'low',
    densityPercent: 28,
    peakHours: '11:00 AM - 2:00 PM',
    liveSpots: [
      {
        id: 'spot_a1',
        name: 'Borra Caves Entrance',
        level: 'moderate',
        percent: 45,
        status: 'Comfortable flow',
        alternatives: []
      },
      {
        id: 'spot_a2',
        name: 'Padmapuram Botanical Gardens',
        level: 'low',
        percent: 22,
        status: 'Peaceful & Quiet',
        alternatives: []
      }
    ]
  },
  'dest_tirupati': {
    overallCrowdLevel: 'high',
    densityPercent: 94,
    peakHours: 'All Day',
    liveSpots: [
      {
        id: 'spot_t1',
        name: 'Tirumala Main Sanctum Queue',
        level: 'high',
        percent: 96,
        status: 'Very Heavy Rush',
        alternatives: [
          { name: 'Chandragiri Fort & Gardens', distance: '14 km', crowd: 'low', reason: 'Vijayanagara architectural palace with peaceful lakeside lawns.' },
          { name: 'Talakona Waterfalls Eco Trail', distance: '45 km', crowd: 'low', reason: 'Highest waterfall in Andhra Pradesh nestled inside deep wildlife reserve.' },
          { name: 'Silathoranam Geological Park', distance: '3 km', crowd: 'moderate', reason: 'Rare 2.5 billion year old natural rock bridge with shaded walks.' }
        ]
      }
    ]
  }
};
