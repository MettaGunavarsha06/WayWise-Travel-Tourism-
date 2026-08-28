export const hotels = [
  {
    id: 'hotel_v1',
    destinationId: 'dest_vizag',
    destinationName: 'Visakhapatnam',
    name: 'Bay Breeze Eco-Luxury Resort',
    type: 'Eco-Luxury Resort',
    rating: 4.8,
    reviewsCount: 340,
    pricePerNight: 4200,
    cheaperAlternativeId: 'hotel_v3',
    distanceFromAttraction: '0.4 km from RK Beach',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'
    ],
    facilities: ['Free High-Speed WiFi', 'Infinity Sea-View Pool', '100% Solar Powered', 'Organic Coastal Dining', 'EV Fast Charging', 'Free Bicycle Rental'],
    sustainabilityScore: 92,
    sustainabilityBadges: ['Zero Single-Use Plastic', 'Solar Microgrid', 'Local Farm Produce Sourcing'],
    isRecommended: true,
    description: 'Overlooking the azure Bay of Bengal, Bay Breeze seamlessly merges five-star coastal hospitality with state-of-the-art green architecture and renewable power.',
    address: 'Beach Road, Maharanipeta, Visakhapatnam, AP 530002',
    coordinates: { latitude: 17.7120, longitude: 83.3240 },
    reviews: [
      { id: 'r1', user: 'Ananya S.', rating: 5, comment: 'Breathtaking ocean views and loved the organic breakfast sourced from local farms!' },
      { id: 'r2', user: 'Rahul Verma', rating: 4.8, comment: 'Spotless clean, EV charging was super handy for our road trip.' }
    ]
  },
  {
    id: 'hotel_v2',
    destinationId: 'dest_vizag',
    destinationName: 'Visakhapatnam',
    name: 'Dolphin Heritage Coastal Hotel',
    type: 'Boutique Hotel',
    rating: 4.6,
    reviewsCount: 220,
    pricePerNight: 2800,
    cheaperAlternativeId: 'hotel_v3',
    distanceFromAttraction: '1.2 km from Submarine Museum',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
    ],
    facilities: ['High-Speed WiFi', 'Complimentary Breakfast', 'Eco Rain Shower', 'Airport Shuttle', 'Business Lounge'],
    sustainabilityScore: 85,
    sustainabilityBadges: ['Rainwater Harvesting', 'Energy Efficient LEDs', 'Artisanal Decor'],
    isRecommended: false,
    description: 'Modern luxury nestled near prime cultural hubs. Ideal for families and business travelers seeking comfort and convenience.',
    address: 'Daba Gardens, Central Vizag, AP 530020',
    coordinates: { latitude: 17.7180, longitude: 83.3020 },
    reviews: [
      { id: 'r3', user: 'Kiran K.', rating: 4.5, comment: 'Comfortable rooms and walking distance to shopping centers.' }
    ]
  },
  {
    id: 'hotel_v3',
    destinationId: 'dest_vizag',
    destinationName: 'Visakhapatnam',
    name: 'Sagar Kanya Eco-Homestay & Lodge',
    type: 'Community Homestay / Budget',
    rating: 4.7,
    reviewsCount: 180,
    pricePerNight: 1400,
    cheaperAlternativeId: null,
    distanceFromAttraction: '0.8 km from RK Beach',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80'
    ],
    facilities: ['Free WiFi', 'Home-cooked Local Meals', 'Terrace Garden', 'Hot Water', 'Filtered RO Water'],
    sustainabilityScore: 95,
    sustainabilityBadges: ['Community Owned', 'Zero Waste Kitchen', 'Terrace Herbal Garden'],
    isRecommended: true,
    description: 'Warm local hospitality run by a welcoming coastal family. Authentic Andhra delicacies, immaculate cleanliness, and low environmental footprint.',
    address: 'Lawson’s Bay Colony, Visakhapatnam, AP 530017',
    coordinates: { latitude: 17.7340, longitude: 83.3410 },
    reviews: [
      { id: 'r4', user: 'Pooja Reddy', rating: 5, comment: 'Best budget stay ever! The homemade seafood and pootharekulu were incredible.' }
    ]
  },
  {
    id: 'hotel_a1',
    destinationId: 'dest_araku',
    destinationName: 'Araku Valley',
    name: 'Misty Pines Organic Coffee Eco-Retreat',
    type: 'Eco-Resort',
    rating: 4.9,
    reviewsCount: 290,
    pricePerNight: 3500,
    cheaperAlternativeId: 'hotel_a2',
    distanceFromAttraction: '1.5 km from Borra Caves',
    image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80'
    ],
    facilities: ['Campfire & Stargazing', 'Organic Estate Coffee Tours', 'Solar Heated Cabins', 'Traditional Bamboo Cooking Dinners'],
    sustainabilityScore: 98,
    sustainabilityBadges: ['100% Off-Grid Solar', 'Tribal Cooperative Partnership', 'Composting Waste Treatment'],
    isRecommended: true,
    description: 'Immerse in the aromatic shade of silver oaks and coffee bushes. Wooden eco-cottages constructed using reclaimed timber and natural bamboo.',
    address: 'Coffee Board Road, Araku Valley, AP 531149',
    coordinates: { latitude: 18.3320, longitude: 82.8810 },
    reviews: [
      { id: 'r5', user: 'Venkatesh M.', rating: 5, comment: 'Magical mornings with freshly ground organic coffee looking out at the foggy valley.' }
    ]
  },
  {
    id: 'hotel_a2',
    destinationId: 'dest_araku',
    destinationName: 'Araku Valley',
    name: 'Tribal Green Heritage Homestay',
    type: 'Community Homestay',
    rating: 4.8,
    reviewsCount: 140,
    pricePerNight: 1200,
    cheaperAlternativeId: null,
    distanceFromAttraction: '0.5 km from Tribal Museum',
    image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80'],
    facilities: ['Local Guided Treks', 'Traditional Cooking', 'Hot Water', 'Bonfire', 'Craft Workshops'],
    sustainabilityScore: 96,
    sustainabilityBadges: ['Indigenous Managed', 'Rainwater Harvesting', 'Plastic-Free Guarantee'],
    isRecommended: true,
    description: 'Experience genuine tribal hospitality with local folk stories, authentic millet rotis, and peaceful countryside vistas.',
    address: 'Near Tribal Museum, Padmapuram, Araku, AP 531149',
    coordinates: { latitude: 18.3240, longitude: 82.8690 },
    reviews: [
      { id: 'r6', user: 'Aditya S.', rating: 4.9, comment: 'Unmatched authenticity and genuine warmth from the hosts.' }
    ]
  },
  {
    id: 'hotel_t1',
    destinationId: 'dest_tirupati',
    destinationName: 'Tirupati',
    name: 'Seshadri Divine Eco-Inn',
    type: 'Heritage Hotel',
    rating: 4.7,
    reviewsCount: 510,
    pricePerNight: 2400,
    cheaperAlternativeId: 'hotel_t2',
    distanceFromAttraction: '3 km from Alipiri Foothills',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80'],
    facilities: ['Pure Vegetarian Sattvic Restaurant', 'Temple EV Shuttle', 'Free High-Speed WiFi', '24/7 Hot Water'],
    sustainabilityScore: 88,
    sustainabilityBadges: ['Solar Water Heating', 'Zero Waste Sattvic Kitchen', 'Temple Floral Waste Upcycling'],
    isRecommended: true,
    description: 'Serene spiritual retreat with pure vegetarian dining, quiet meditation gardens, and dedicated electric transit to Alipiri.',
    address: 'Renigunta Road, Tirupati, AP 517501',
    coordinates: { latitude: 13.6320, longitude: 79.4280 },
    reviews: [
      { id: 'r7', user: 'Srinivas R.', rating: 4.8, comment: 'Clean, peaceful, and the early morning temple shuttle service is fantastic.' }
    ]
  },
  {
    id: 'hotel_t2',
    destinationId: 'dest_tirupati',
    destinationName: 'Tirupati',
    name: 'Govinda Pilgrim Heritage Guest House',
    type: 'Budget Pilgrim Stay',
    rating: 4.5,
    reviewsCount: 320,
    pricePerNight: 1100,
    cheaperAlternativeId: null,
    distanceFromAttraction: '1.5 km from Tirupati Railway Station',
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80'],
    facilities: ['24/7 Front Desk', 'Hot Water', 'Luggage Storage', 'Free Filtered Water'],
    sustainabilityScore: 84,
    sustainabilityBadges: ['Water Refill Station', 'Energy-Star Cooling'],
    isRecommended: false,
    description: 'Clean, dependable, and budget-friendly accommodation located conveniently near the central bus and railway hub.',
    address: 'TP Area, Near Bus Stand, Tirupati, AP 517501',
    coordinates: { latitude: 13.6290, longitude: 79.4210 },
    reviews: [
      { id: 'r8', user: 'Madhav N.', rating: 4.5, comment: 'Great budget stay, courteous staff and very close to the station.' }
    ]
  },
  {
    id: 'hotel_g1',
    destinationId: 'dest_goa',
    destinationName: 'Goa',
    name: 'Palolem Eco Canopy Villas',
    type: 'Eco Boutique Resort',
    rating: 4.8,
    reviewsCount: 420,
    pricePerNight: 4800,
    cheaperAlternativeId: 'hotel_g2',
    distanceFromAttraction: '0.2 km from Palolem Beach',
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80'],
    facilities: ['Ayurvedic Spa & Yoga Shala', 'Organic Vegan Beach Cafe', 'Kayak & Paddleboard Gear', 'Solar Heated Plunge Pools'],
    sustainabilityScore: 94,
    sustainabilityBadges: ['No Plastic Zone', 'Bio-Septic Water Recycling', 'Turtle Conservation Partner'],
    isRecommended: true,
    description: 'Luxury bamboo-thatched cottages nestled under swaying coconut groves, minutes from clean soft sands.',
    address: 'South End, Palolem Beach, Canacona, South Goa 403702',
    coordinates: { latitude: 15.0100, longitude: 74.0230 },
    reviews: [
      { id: 'r9', user: 'Elena Rossi', rating: 5, comment: 'Absolute tranquility! The morning beach yoga and fresh coconuts made my vacation.' }
    ]
  },
  {
    id: 'hotel_g2',
    destinationId: 'dest_goa',
    destinationName: 'Goa',
    name: 'Vasco Green Palms Homestay',
    type: 'Heritage Homestay / Budget',
    rating: 4.6,
    reviewsCount: 190,
    pricePerNight: 1600,
    cheaperAlternativeId: null,
    distanceFromAttraction: '1.0 km from Benaulim Coast',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'],
    facilities: ['Portuguese Heritage Courtyard', 'Kitchen Access', 'Bicycle Rental', 'Free WiFi'],
    sustainabilityScore: 90,
    sustainabilityBadges: ['Heritage Restoration', 'Local Seafood Community Sourcing'],
    isRecommended: true,
    description: '100-year-old Portuguese-Goan villa with terracotta tiles, oyster shell windows, and home-cooked fish curry.',
    address: 'Benaulim Road, South Goa 403716',
    coordinates: { latitude: 15.2500, longitude: 73.9300 },
    reviews: [
      { id: 'r10', user: 'Carlos M.', rating: 4.7, comment: 'Charming Portuguese architecture, felt like home!' }
    ]
  }
];
