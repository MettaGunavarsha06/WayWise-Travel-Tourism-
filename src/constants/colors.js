// WayWise Design System — Multi-Theme Visual Tokens
// Includes: Premium Glassmorphism (Deep Navy, Soft Blue, Frosted White, Warm Gold),
// Vintage Voyager (Heritage Maps + Modern Luxury), Obsidian Dark, and Emerald Nature

export const GlassHorizonTheme = {
  name: 'glass_horizon',
  displayName: 'Glassmorphism Luxe',
  subtitle: 'Frosted Glass · Deep Navy, Soft Blue & Warm Gold',
  mode: 'glass_horizon',
  isDark: false,

  // === Primary Brand: Deep Classic Navy ===
  primary: '#1E3A5F',        // Deep classic navy — elegant luxury buttons & active states
  primaryDark: '#0A192F',    // Deepest navy
  primaryLight: 'rgba(30, 58, 95, 0.08)', // Subtle luxury navy wash
  primaryMid: '#2C5282',     // Medium navy

  // === Secondary: Soft Atmospheric Blue ===
  secondary: '#4A7BB0',      // Soft classic blue
  secondaryLight: 'rgba(74, 123, 176, 0.10)',

  // === Accent: Subtle Warm Gold ===
  accent: '#C5A059',        // Subtle warm gold — classic luxury accent
  accentLight: 'rgba(197, 160, 89, 0.14)',

  // === Backgrounds & Surfaces (Frosted Glass & Semi-Transparent Surfaces) ===
  background: '#E8F0F7',     // Soft atmospheric mist background for deep layered glass depth
  card: 'rgba(255, 255, 255, 0.76)',          // Frosted glass card with subtle transparency
  cardSecondary: 'rgba(255, 255, 255, 0.52)', // Translucent layered glass card
  surface: 'rgba(255, 255, 255, 0.78)',
  surfaceElevated: 'rgba(255, 255, 255, 0.90)',

  // === Text: Deep Navy & Slate ===
  text: '#0A192F',           // Deep luxury navy — rich readability
  textSecondary: '#334E68',  // Refined slate navy
  textMuted: '#627D98',      // Muted atmospheric blue-gray

  // === Borders: Thin White Specular Glass Rims ===
  border: 'rgba(255, 255, 255, 0.85)',        // Thin crisp white frosted glass border
  borderLight: 'rgba(255, 255, 255, 0.50)',

  // === Semantic Colors ===
  error: '#D32F2F',
  errorLight: 'rgba(211, 47, 47, 0.10)',
  success: '#1E3A5F',
  successLight: 'rgba(30, 58, 95, 0.10)',
  warning: '#C5A059',
  warningLight: 'rgba(197, 160, 89, 0.15)',
  info: '#4A7BB0',
  infoLight: 'rgba(74, 123, 176, 0.12)',

  // === Eco / Sustainability / Accents ===
  ecoGreen: '#1E3A5F',
  ecoGreenLight: 'rgba(30, 58, 95, 0.08)',
  ecoGreenMid: '#4A7BB0',
  gold: '#C5A059',
  goldLight: 'rgba(197, 160, 89, 0.14)',

  // === UI Chrome: Frosted Glass Elements ===
  glassBg: 'rgba(255, 255, 255, 0.76)',
  glassBorder: 'rgba(255, 255, 255, 0.90)',
  shadow: 'rgba(10, 25, 47, 0.10)',
  tabBar: 'rgba(255, 255, 255, 0.88)',
  tabBarInactive: '#627D98',
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
    name: 'Glassmorphism Luxe',
    tagline: 'Frosted Glass · Deep Navy, Soft Blue & Warm Gold',
    badge: 'Premium Glass',
    theme: GlassHorizonTheme,
    primaryColor: '#1E3A5F',
    bgColor: '#E8F0F7',
    accentColor: '#C5A059',
    cardColor: 'rgba(255, 255, 255, 0.76)',
    icon: 'diamond-outline',
    description: 'Classic luxury frosted glass cards with thin white specular borders, deep navy typography, soft blue surfaces, and subtle warm gold accents.',
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
