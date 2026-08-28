# SmartTour – AI-Powered Integrated Tourism Management & Travel Planning Platform
### Smart India Hackathon (SIH) 2026 Prototype

**SmartTour** is a modern, full-featured React Native mobile application engineered for **Expo Go**. It bridges the gap between tourists, hotels, transport providers, local artisans, hidden gem destinations, and state tourism authorities into a single unified ecosystem.

---

## 🌟 Key Features & Innovations

1. **✨ 6-Step AI Smart Trip Planner**:
   - Interactive questionnaire covering Destination, Number of Days (1-7), Travelers, Budget, Interests (Nature, History, Adventure, Beaches, Food, Shopping, Culture, Temples, Photography, Wildlife), and Travel Style (Cheapest, Fastest, Comfortable, Eco-friendly).
   - Generates a day-by-day customized itinerary with timed activities, estimated costs, and matched lodging and transit.

2. **💰 AI Budget Optimizer**:
   - Dynamic itemized breakdown across Hotels, Transport, Food, Activities, Shopping, and Contingency.
   - Real-time over-budget alert (e.g., *"Plan exceeds budget by ₹1,850"*).
   - 1-Click Optimization algorithm: Replaces expensive options with verified community eco-homestays, express trains/buses, and free heritage walks, creating a healthy surplus while boosting trip eco-scores.

3. **🌧️ Weather-Based Itinerary Adjustment**:
   - Live simulated weather radar ("*Rain expected tomorrow*").
   - 1-Click *"Apply Suggested Changes"* dynamically swaps outdoor hilltop and beach stops to air-conditioned naval museums (INS Kursura Submarine & TU 142 Aircraft Simulator) and indoor artisan galleries.

4. **👥 Crowd-Aware Anti-Overtourism & Hidden Gems**:
   - Live crowd density tags (🟢 Low, 🟡 Moderate, 🔴 High).
   - Automatically recommends tranquil, lesser-known alternatives (e.g., Yarada Beach instead of crowded RK Beach, Araku Valley instead of congested hill stations).

5. **🏨 Smart Eco-Hotel Discovery**:
   - Filters by budget, 4.7+ rating, and **Eco Score 90+ 🌱** (Solar microgrids, zero single-use plastic, rainwater harvesting, local farm sourcing).
   - Photo galleries, guest reviews, and simulated reservations.

6. **🚆 Multi-Modal Transport Comparison Matrix**:
   - Compares Bus, Train (Vande Bharat/Intercity), Taxi, E-Auto, Metro, and Walking Trails on Time, Cost, Comfort, and Carbon Footprint (kg CO₂).

7. **🏪 Local Business Marketplace & Vendor Onboarding**:
   - Direct connection to local homestays, licensed heritage guides, restaurants, and traditional artisans (Etikoppaka lacquer wooden toys, Bagru block prints, Araku tribal coffee).
   - **"Register Your Business"** form allowing local vendors to register on the platform with local storage persistence.

8. **🗺️ Interactive Smart Tourism Map**:
   - Multi-category filter chips (Attractions, Hotels, Food, Transport, Artisans, Hidden Gems, Eco-spots, Hospitals, Police).
   - GPS live coordinates integration and bottom information cards with turn-by-turn simulation.

9. **📱 Digital Tourism Pass (SMARTTOUR PASS)**:
   - Generated SVG QR code with Trip ID (`ST2026XXXX`), traveler credentials, and validity badges.
   - Pass perks: Express fast-track QR entry, 10% artisan discounts, and free EV beach shuttle access.

10. **🤖 SmartTour AI Assistant & Voice Support**:
    - Contextual chatbot with quick question chips (*"Suggest places near me"*, *"I have ₹2,000 remaining"*, *"Change tomorrow's plan because of rain"*).
    - Speech synthesis (`expo-speech`) to read answers aloud.

11. **🚨 Emergency SOS Hub**:
    - 1-Touch dispatch simulation for Police (112), Ambulance (108), National Tourist Helpline (1363), and Hospitals.
    - Live GPS coordinates capture and emergency broadcast.

12. **🌐 Multilingual & Dark Mode Support**:
    - Dynamic in-app translation for **English, Hindi (हिन्दी), Telugu (తెలుగు), Tamil (தமிழ்), Kannada (ಕನ್ನಡ), and Malayalam (മലയാളം)**.
    - Full Light / Dark mode themes.

13. **🏛️ Tourism Authority / Admin Dashboard**:
    - High-level KPIs: Total Tourists (1.2M+), Daily Arrivals (+12.4%), Hotel Occupancy (78.5%), Registered Artisans (3,420), Direct Local Economic Impact (₹48.6 Cr).
    - Real-time destination capacity meters and crowd heatmaps.
    - Tourist grievance resolution desk with action dispatching.
    - Sustainability & plastic diversion metrics monitor.

---

## 🗂️ Project Directory Structure

```
WayWise-Travel-Tourism-/
├── App.js                         # Root entry with Providers & Safe Area
├── app.json                       # Expo application metadata & permissions
├── package.json                   # Expo SDK 52 dependencies
├── babel.config.js                # Babel preset configuration
├── assets/                        # App icons, adaptive icons, and splash
└── src/
    ├── constants/
    │   ├── colors.js              # Light & Dark color tokens, Glassmorphism
    │   └── typography.js          # Font scale & weights
    ├── context/
    │   ├── AuthContext.js         # User state, guest mode & role switcher
    │   ├── ThemeContext.js        # Light/Dark mode state with persistence
    │   ├── LanguageContext.js     # Multilingual translations (EN, HI, TE, TA, KN, ML)
    │   ├── TripContext.js         # Dynamic AI itineraries & budget optimization
    │   ├── BusinessContext.js     # Local vendor marketplace & registration
    │   └── NotificationContext.js # In-app notification queue & alerts
    ├── data/
    │   ├── destinations.js        # Rich Indian destinations (Vizag, Araku, Tirupati, Goa, etc.)
    │   ├── hotels.js              # Eco-resorts, pricing, amenities, sustainability scores
    │   ├── transport.js           # Multi-modal matrix (Train, Bus, Taxi, Auto, Metro)
    │   ├── businesses.js          # Homestays, artisans, local guides, cafes
    │   ├── weather.js             # Forecasts & rain rescheduling triggers
    │   ├── crowdData.js           # Crowd densities & alternative routing
    │   ├── adminStats.js          # Authority KPIs, grievances & eco metrics
    │   └── translations.js        # Dictionaries for 6 Indian languages
    ├── navigation/
    │   ├── AppNavigator.js        # Root Navigation Stack
    │   └── BottomTabNavigator.js  # 5-Tab bar (Home, Explore, Trips, Map, Profile)
    ├── screens/
    │   ├── auth/
    │   │   ├── OnboardingScreen.js
    │   │   ├── LoginScreen.js
    │   │   └── RegisterScreen.js
    │   ├── home/
    │   │   ├── HomeScreen.js
    │   │   └── DestinationDetailScreen.js
    │   ├── planner/
    │   │   ├── TripPlannerWizardScreen.js
    │   │   ├── ItineraryDetailScreen.js
    │   │   ├── BudgetOptimizerScreen.js
    │   │   ├── DigitalPassScreen.js
    │   │   └── MyTripsScreen.js
    │   ├── explore/
    │   │   ├── ExploreScreen.js
    │   │   ├── HotelsScreen.js
    │   │   ├── HotelDetailScreen.js
    │   │   ├── TransportScreen.js
    │   │   ├── HiddenGemsScreen.js
    │   │   ├── LocalBusinessScreen.js
    │   │   └── RegisterBusinessScreen.js
    │   ├── map/
    │   │   └── SmartMapScreen.js
    │   ├── assistant/
    │   │   └── AIAssistantScreen.js
    │   ├── emergency/
    │   │   └── EmergencySOSScreen.js
    │   ├── profile/
    │   │   ├── ProfileScreen.js
    │   │   ├── FeedbackScreen.js
    │   │   └── NotificationsScreen.js
    │   └── admin/
    │       └── AdminDashboardScreen.js
    ├── components/
    │   ├── Header.js
    │   ├── Button.js
    │   ├── Input.js
    │   ├── DestinationCard.js
    │   ├── HotelCard.js
    │   ├── BusinessCard.js
    │   ├── CrowdIndicator.js
    │   ├── EcoScoreBadge.js
    │   ├── WeatherAlertCard.js
    │   ├── BudgetBreakdownChart.js
    │   ├── QRCodeView.js
    │   └── MetricCard.js
    └── utils/
        ├── aiEngine.js
        ├── budgetOptimizer.js
        ├── locationService.js
        └── helpers.js
```

---

## 🚀 Quick Start & How to Run

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- **Expo Go app** installed on your physical mobile phone (iOS / Android), or an iOS simulator / Android emulator.

### 2. Installation
```bash
# Clone the repository and navigate into the workspace
cd WayWise-Travel-Tourism-

# Install all required dependencies
npm install
```

### 3. Launch the Project
```bash
npx expo start
```

### 4. Running on Your Mobile Device with Expo Go
1. After running `npx expo start`, a QR code will display in the terminal.
2. **Android**: Open the **Expo Go** app and scan the QR code.
3. **iOS**: Open the native **Camera** app, scan the QR code, and tap the prompt to open in Expo Go.
4. **Web Browser (Optional preview)**: Press `w` in the terminal to view on web.

---

## 🔄 How to Switch Between Tourist Mode & Tourism Authority Mode

There are **two easy ways** to switch modes instantly for evaluation:

1. **Header Pill (Top Bar on Every Screen)**:
   - Look at the top right of the Header next to the logo.
   - Tap the pill labeled **`Tourist`** or **`Admin`** to toggle instantly between Tourist experience and the Tourism Authority Dashboard.
2. **Profile Screen**:
   - Navigate to the **Profile** tab -> Tap **`Switch to Authority Dashboard`** or **`Switch to Tourist Mode`**.
3. **Login Screen**:
   - On the login screen, tap **`🏛️ Tourism Authority Admin Demo`** to jump directly into the authority portal.

---

## 🏆 Smart India Hackathon (SIH 2026) Evaluation Guide (30-Second Demo)

When demonstrating to judges:
1. **Home Screen**: Show the **`⚡ 30-SEC SIH 2026 DEMO`** banner -> Tap **`✨ Create AI Trip`**.
2. **AI Wizard**: Complete the 6 steps (Visakhapatnam -> 4 Days -> 2 Travelers -> ₹15,000 -> Nature/Beaches/History -> Comfortable).
3. **Generated Itinerary**: Notice the day-by-day plan, hotel matching, and transit options.
4. **Rain Weather Adaptation**: Notice the banner *"🌧️ Rain is expected tomorrow"* -> Tap **`Apply Suggested Changes`** -> Observe how the day's outdoor activities instantly swap to indoor submarine/aviation museums.
5. **AI Budget Optimizer**: Tap **`Optimize Budget`** -> View savings breakdown and how over-budget deficits are automatically eliminated.
6. **Digital Pass**: Tap the **QR Code Pass** icon in the header -> Inspect the generated **SmartTour Pass** with QR code.
7. **Smart Map & Hidden Gems**: Explore the Map with live category chips, GPS location, and offbeat destinations with crowd levels (🟢/🟡/🔴).
8. **Local Artisans & Registration**: Open Local Businesses -> Tap **`+ Register`** -> Add a local vendor to show persistent onboarding.
9. **Tourism Authority Dashboard**: Tap the **`Admin`** header badge -> Walk through state-wide footfalls, crowd capacity bars, local economy impact (₹48.6 Cr), and tourist grievance resolution.
10. **Multilingual / Voice**: Switch languages to Hindi/Telugu/Tamil or test the voice assistant in **SmartTour AI**.