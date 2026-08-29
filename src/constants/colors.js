// WayWise Design System — Multi-Theme Visual Tokens
// Includes: Glass Horizon (Floating Glassmorphism), Vintage Voyager (Heritage Maps + Modern Luxury), Obsidian Dark, and Emerald Nature

export const GlassHorizonTheme = {
  name: 'glass_horizon',
  displayName: 'Glass Horizon',
  subtitle: 'Floating Glassmorphism · Translucent Frost & Azure',
  mode: 'glass_horizon',
  isDark: false,

  // === Primary Brand: Luminous Azure & Oceanic Cyan ===
  primary: '#0284C7',        // Luminous azure blue
  primaryDark: '#0369A1',    // Deep ocean blue
  primaryLight: 'rgba(2, 132, 199, 0.12)', // Subtle translucent azure tint
  primaryMid: '#0EA5E9',     // Sky blue

  // === Secondary ===
  secondary: '#38BDF8',      // Bright azure cyan
  secondaryLight: 'rgba(56, 189, 248, 0.15)',

  // === Accent ===
  accent: '#06B6D4',        // Vibrant cyan
  accentLight: 'rgba(6, 182, 212, 0.15)',

  // === Backgrounds & Surfaces (Floating Semi-Transparent Frosted Glass) ===
  background: '#D6EAF8',     // Luminous sky blue wallpaper so translucent cards float vividly
  card: 'rgba(255, 255, 255, 0.72)',          // Semi-transparent frosted glass surface
  cardSecondary: 'rgba(255, 255, 255, 0.50)', // Layered semi-transparent frosted card
  surface: 'rgba(255, 255, 255, 0.75)',
  surfaceElevated: 'rgba(255, 255, 255, 0.88)',

  // === Text (High Contrast Oceanic Navy) ===
  text: '#0C4A6E',           // Deep oceanic navy
  textSecondary: '#0369A1',  // Medium cyan-navy
  textMuted: '#52799B',      // Slate muted

  // === Borders (Glossy Crystal Specular White Rim) ===
  border: 'rgba(255, 255, 255, 0.90)',        // Crisp white specular glass border
  borderLight: 'rgba(255, 255, 255, 0.55)',

  // === Semantic Colors ===
  error: '#EF4444',
  errorLight: 'rgba(239, 68, 68, 0.15)',
  success: '#0EA5E9',
  successLight: 'rgba(14, 165, 233, 0.15)',
  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.15)',
  info: '#0284C7',
  infoLight: 'rgba(2, 132, 199, 0.15)',

  // === Eco / Sustainability ===
  ecoGreen: '#0284C7',
  ecoGreenLight: 'rgba(2, 132, 199, 0.12)',
  ecoGreenMid: '#38BDF8',

  // === UI Chrome ===
  glassBg: 'rgba(255, 255, 255, 0.70)',
  glassBorder: 'rgba(255, 255, 255, 0.95)',
  shadow: 'rgba(2, 132, 199, 0.30)',
  tabBar: 'rgba(255, 255, 255, 0.82)',
  tabBarInactive: '#52799B',
  statusBar: 'dark',
};

export const VintageVoyagerTheme = {
  name: 'vintage_voyager',
  displayName: 'Vintage Voyager',
  subtitle: 'Heritage Cartography · Antique Maps & Modern Luxury',
  mode: 'vintage_voyager',
  isDark: false,

  // === Primary Brand: Burnished Brass & Antique Terracotta ===
  primary: '#B45309',        // Burnished antique brass
  primaryDark: '#78350F',    // Deep saddle leather amber
  primaryLight: '#FEF3C7',   // Warm golden parchment tint
  primaryMid: '#D97706',     // Warm amber

  // === Secondary ===
  secondary: '#C2410C',      // Aged terracotta
  secondaryLight: '#FFEDD5',

  // === Accent ===
  accent: '#CA8A04',        // Antique gold
  accentLight: '#FEF9C3',

  // === Backgrounds & Surfaces (Aged Map Parchment) ===
  background: '#FAF6ED',     // Warm aged antique parchment
  card: '#FFFFFF',           // Crisp parchment surface
  cardSecondary: '#F3EBDD',  // Sepia-tinted secondary card
  surface: '#FFFFFF',
  surfaceElevated: '#FFFDF9',

  // === Text (Sepia & Espresso Leather) ===
  text: '#2C1E14',           // Deep sepia espresso
  textSecondary: '#78563B',  // Warm antique leather brown
  textMuted: '#A8907A',      // Muted cartography tan

  // === Borders (Antique Map Line Contours) ===
  border: '#E5D9C3',         // Aged parchment contour border
  borderLight: '#F1E9DB',

  // === Semantic Colors ===
  error: '#DC2626',
  errorLight: '#FEE2E2',
  success: '#854D0E',
  successLight: '#FEF3C7',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  info: '#1E293B',
  infoLight: '#F1F5F9',

  // === Eco / Sustainability ===
  ecoGreen: '#854D0E',
  ecoGreenLight: '#FEF3C7',
  ecoGreenMid: '#B45309',

  // === UI Chrome ===
  glassBg: 'rgba(250, 246, 237, 0.94)',
  glassBorder: 'rgba(202, 138, 4, 0.35)',
  shadow: '#2C1E14',
  tabBar: '#FAF6ED',
  tabBarInactive: '#8C715A',
  statusBar: 'dark',
};

export const DarkTheme = {
  name: 'dark',
  displayName: 'Obsidian Dark',
  subtitle: 'Pure Deep Black · OLED Charcoal & Emerald',
  mode: 'dark',
  isDark: true,

  // === Primary Brand: Vibrant Emerald ===
  primary: '#10B981',        // Vibrant emerald green
  primaryDark: '#059669',    // Deep emerald
  primaryLight: 'rgba(16, 185, 129, 0.16)', // Subtle emerald tint
  primaryMid: '#34D399',     // Mid emerald

  // === Secondary ===
  secondary: '#34D399',
  secondaryLight: 'rgba(52, 211, 153, 0.16)',

  // === Accent ===
  accent: '#F59E0B',
  accentLight: 'rgba(245, 158, 11, 0.16)',

  // === Backgrounds & Surfaces (Obsidian Black) ===
  background: '#09090B',     // Deep obsidian black
  card: '#121215',           // Dark neutral card
  cardSecondary: '#18181C',  // Secondary charcoal
  surface: '#121215',
  surfaceElevated: '#1E1E24',

  // === Text (Clean Slate & Neutral) ===
  text: '#F4F4F5',           // Crisp near-white
  textSecondary: '#A1A1AA',  // Clean neutral light gray
  textMuted: '#71717A',      // Muted neutral gray

  // === Borders ===
  border: '#27272A',         // Clean subtle border
  borderLight: '#1E1E24',

  // === Semantic Colors ===
  error: '#EF4444',
  errorLight: 'rgba(239, 68, 68, 0.16)',
  success: '#10B981',
  successLight: 'rgba(16, 185, 129, 0.16)',
  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.16)',
  info: '#3B82F6',
  infoLight: 'rgba(59, 130, 246, 0.16)',

  // === Eco / Sustainability ===
  ecoGreen: '#10B981',
  ecoGreenLight: 'rgba(16, 185, 129, 0.16)',
  ecoGreenMid: '#059669',

  // === UI Chrome ===
  glassBg: 'rgba(18, 18, 21, 0.92)',
  glassBorder: 'rgba(39, 39, 42, 0.8)',
  shadow: '#000000',
  tabBar: '#09090B',
  tabBarInactive: '#71717A',
  statusBar: 'light',
};

export const LightTheme = {
  name: 'light',
  displayName: 'Emerald Nature',
  subtitle: 'Sustainable Tourism · Forest Mint & Warm Slate',
  mode: 'light',
  isDark: false,

  // === Primary Brand: Forest Green ===
  primary: '#2E7D32',        // Medium forest green
  primaryDark: '#1B5E20',    // Deep forest green
  primaryLight: '#E8F5E9',   // Soft mint
  primaryMid: '#388E3C',     // Mid green

  // === Secondary ===
  secondary: '#43A047',
  secondaryLight: '#C8E6C9',

  // === Accent ===
  accent: '#F59E0B',
  accentLight: '#FEF3C7',

  // === Backgrounds & Surfaces ===
  background: '#F7F9F4',     // Warm off-white
  card: '#FFFFFF',
  cardSecondary: '#F1F7EF',  // Very light green-tinted surface
  surface: '#FFFFFF',
  surfaceElevated: '#FAFCF8',

  // === Text ===
  text: '#1A2E1A',           // Dark charcoal-green
  textSecondary: '#4A6741',  // Muted gray-green
  textMuted: '#8FAF8A',      // Very muted green-gray

  // === Borders ===
  border: '#D5E8D0',         // Soft green border
  borderLight: '#EAF4E7',

  // === Semantic Colors ===
  error: '#D32F2F',
  errorLight: '#FFEBEE',
  success: '#2E7D32',
  successLight: '#E8F5E9',
  warning: '#E65100',
  warningLight: '#FFF3E0',
  info: '#1565C0',
  infoLight: '#E3F2FD',

  // === Eco / Sustainability ===
  ecoGreen: '#2E7D32',
  ecoGreenLight: '#E8F5E9',
  ecoGreenMid: '#A5D6A7',

  // === UI Chrome ===
  glassBg: 'rgba(255, 255, 255, 0.88)',
  glassBorder: 'rgba(213, 232, 208, 0.8)',
  shadow: '#1A2E1A',
  tabBar: '#FFFFFF',
  tabBarInactive: '#7A9E76',
  statusBar: 'dark',
};

export const THEMES_LIST = [
  {
    id: 'glass_horizon',
    name: 'Glass Horizon',
    tagline: 'Floating Glassmorphism · Translucent Frost & Azure',
    badge: 'Floating Glass',
    theme: GlassHorizonTheme,
    primaryColor: '#0284C7',
    bgColor: '#D6EAF8',
    accentColor: '#38BDF8',
    cardColor: 'rgba(255, 255, 255, 0.72)',
    icon: 'cube-outline',
    description: 'Floating semi-transparent frosted glass surfaces, luminous cyan reflections, and sleek luxury travel aesthetics.',
  },
  {
    id: 'vintage_voyager',
    name: 'Vintage Voyager',
    tagline: 'Heritage Cartography · Antique Maps & Modern Luxury',
    badge: 'Heritage Map',
    theme: VintageVoyagerTheme,
    primaryColor: '#B45309',
    bgColor: '#FAF6ED',
    accentColor: '#CA8A04',
    cardColor: '#FFFFFF',
    icon: 'compass-outline',
    description: 'Warm aged parchment, old-world navigation brass, antique leather tones, and refined luxury travel typography.',
  },
  {
    id: 'dark',
    name: 'Obsidian Dark',
    tagline: 'Pure Deep Black · OLED Charcoal & Emerald',
    badge: 'Obsidian OLED',
    theme: DarkTheme,
    primaryColor: '#10B981',
    bgColor: '#09090B',
    accentColor: '#F59E0B',
    cardColor: '#121215',
    icon: 'moon-outline',
    description: 'Deep neutral black surfaces with luminous emerald accents tailored for low-light night exploration.',
  },
  {
    id: 'light',
    name: 'Emerald Nature',
    tagline: 'Sustainable Tourism · Forest Mint & Warm Slate',
    badge: 'Classic Nature',
    theme: LightTheme,
    primaryColor: '#2E7D32',
    bgColor: '#F7F9F4',
    accentColor: '#F59E0B',
    cardColor: '#FFFFFF',
    icon: 'leaf-outline',
    description: 'Classic eco-tourism visual identity inspired by nature reserves and green travel.',
  },
];
