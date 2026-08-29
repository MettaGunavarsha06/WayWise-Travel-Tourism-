// WayWise Design System — Multi-Theme Visual Tokens with Dynamic Dark/Light Matrix
// Themes: Glassmorphism Luxe, Vintage Voyager, and Emerald Nature

// ==========================================
// 1. GLASSMORPHISM LUXE THEME (Light & Dark)
// ==========================================
export const GlassmorphismLightTheme = {
  name: 'glass_horizon',
  displayName: 'Glassmorphism Luxe',
  subtitle: 'Frosted Glass · Deep Navy, Soft Blue & Warm Gold',
  mode: 'glass_horizon',
  isDark: false,

  // Primary: Deep Classic Navy
  primary: '#1E3A5F',
  primaryDark: '#0A192F',
  primaryLight: 'rgba(30, 58, 95, 0.08)',
  primaryMid: '#2C5282',

  // Secondary: Soft Atmospheric Blue
  secondary: '#4A7BB0',
  secondaryLight: 'rgba(74, 123, 176, 0.10)',

  // Accent: Subtle Warm Gold
  accent: '#C5A059',
  accentLight: 'rgba(197, 160, 89, 0.14)',

  // Surfaces: Frosted Semi-Transparent Glass
  background: '#E8F0F7',
  card: 'rgba(255, 255, 255, 0.78)',
  cardSecondary: 'rgba(255, 255, 255, 0.54)',
  surface: 'rgba(255, 255, 255, 0.80)',
  surfaceElevated: 'rgba(255, 255, 255, 0.92)',

  // Text
  text: '#0A192F',
  textSecondary: '#334E68',
  textMuted: '#627D98',

  // Borders: Thin White Specular Glass Rims
  border: 'rgba(255, 255, 255, 0.88)',
  borderLight: 'rgba(255, 255, 255, 0.55)',

  // Semantic
  error: '#D32F2F',
  errorLight: 'rgba(211, 47, 47, 0.10)',
  success: '#1E3A5F',
  successLight: 'rgba(30, 58, 95, 0.10)',
  warning: '#C5A059',
  warningLight: 'rgba(197, 160, 89, 0.15)',
  info: '#4A7BB0',
  infoLight: 'rgba(74, 123, 176, 0.12)',

  ecoGreen: '#1E3A5F',
  ecoGreenLight: 'rgba(30, 58, 95, 0.08)',
  ecoGreenMid: '#4A7BB0',
  gold: '#C5A059',
  goldLight: 'rgba(197, 160, 89, 0.14)',

  // UI Chrome: Glass
  glassBg: 'rgba(255, 255, 255, 0.78)',
  glassBorder: 'rgba(255, 255, 255, 0.92)',
  shadow: 'rgba(10, 25, 47, 0.12)',
  tabBar: 'rgba(255, 255, 255, 0.88)',
  tabBarInactive: '#627D98',
  statusBar: 'dark',
};

export const GlassmorphismDarkTheme = {
  name: 'glass_horizon',
  displayName: 'Glassmorphism Luxe (Dark)',
  subtitle: 'Dark Frosted Glass · Midnight Navy, Sky & Gold',
  mode: 'glass_horizon',
  isDark: true,

  // Primary: Luminous Sky Blue / Azure in Dark Mode
  primary: '#38BDF8',
  primaryDark: '#0284C7',
  primaryLight: 'rgba(56, 189, 248, 0.15)',
  primaryMid: '#0EA5E9',

  // Secondary: Soft Slate Blue
  secondary: '#7DD3FC',
  secondaryLight: 'rgba(125, 211, 252, 0.12)',

  // Accent: Warm Gold
  accent: '#F59E0B',
  accentLight: 'rgba(245, 158, 11, 0.16)',

  // Surfaces: Dark Frosted Glass
  background: '#070D15',
  card: 'rgba(15, 26, 44, 0.82)',
  cardSecondary: 'rgba(23, 37, 60, 0.65)',
  surface: 'rgba(15, 26, 44, 0.85)',
  surfaceElevated: 'rgba(28, 45, 72, 0.88)',

  // Text
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',

  // Borders: Luminous Glass Rim
  border: 'rgba(255, 255, 255, 0.14)',
  borderLight: 'rgba(255, 255, 255, 0.08)',

  // Semantic
  error: '#EF4444',
  errorLight: 'rgba(239, 68, 68, 0.16)',
  success: '#38BDF8',
  successLight: 'rgba(56, 189, 248, 0.15)',
  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.16)',
  info: '#38BDF8',
  infoLight: 'rgba(56, 189, 248, 0.15)',

  ecoGreen: '#38BDF8',
  ecoGreenLight: 'rgba(56, 189, 248, 0.15)',
  ecoGreenMid: '#0EA5E9',
  gold: '#F59E0B',
  goldLight: 'rgba(245, 158, 11, 0.16)',

  // UI Chrome: Dark Glass
  glassBg: 'rgba(15, 26, 44, 0.82)',
  glassBorder: 'rgba(255, 255, 255, 0.16)',
  shadow: '#000000',
  tabBar: 'rgba(10, 18, 30, 0.92)',
  tabBarInactive: '#64748B',
  statusBar: 'light',
};

// ==========================================
// 2. VINTAGE VOYAGER THEME (Light & Dark)
// ==========================================
export const VintageVoyagerLightTheme = {
  name: 'vintage_voyager',
  displayName: 'Vintage Voyager',
  subtitle: 'Heritage Cartography · Antique Maps & Modern Luxury',
  mode: 'vintage_voyager',
  isDark: false,

  primary: '#B45309',
  primaryDark: '#78350F',
  primaryLight: '#FEF3C7',
  primaryMid: '#D97706',

  secondary: '#C2410C',
  secondaryLight: '#FFEDD5',

  accent: '#CA8A04',
  accentLight: '#FEF9C3',

  background: '#FAF6ED',
  card: '#FFFFFF',
  cardSecondary: '#F3EBDD',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFDF9',

  text: '#2C1E14',
  textSecondary: '#78563B',
  textMuted: '#A8907A',

  border: '#E5D9C3',
  borderLight: '#F1E9DB',

  error: '#DC2626',
  errorLight: '#FEE2E2',
  success: '#854D0E',
  successLight: '#FEF3C7',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  info: '#1E293B',
  infoLight: '#F1F5F9',

  ecoGreen: '#854D0E',
  ecoGreenLight: '#FEF3C7',
  ecoGreenMid: '#B45309',
  gold: '#CA8A04',
  goldLight: '#FEF9C3',

  glassBg: 'rgba(250, 246, 237, 0.94)',
  glassBorder: 'rgba(202, 138, 4, 0.35)',
  shadow: '#2C1E14',
  tabBar: '#FAF6ED',
  tabBarInactive: '#8C715A',
  statusBar: 'dark',
};

export const VintageVoyagerDarkTheme = {
  name: 'vintage_voyager',
  displayName: 'Vintage Voyager (Dark)',
  subtitle: 'Aged Espresso Leather · Antique Brass & Parchment',
  mode: 'vintage_voyager',
  isDark: true,

  primary: '#D97706',
  primaryDark: '#B45309',
  primaryLight: 'rgba(217, 119, 6, 0.16)',
  primaryMid: '#F59E0B',

  secondary: '#EA580C',
  secondaryLight: 'rgba(234, 88, 12, 0.16)',

  accent: '#FBBF24',
  accentLight: 'rgba(251, 191, 36, 0.16)',

  background: '#16110D',
  card: '#221B15',
  cardSecondary: '#2C221A',
  surface: '#221B15',
  surfaceElevated: '#362B21',

  text: '#FDF8F0',
  textSecondary: '#D4C4B5',
  textMuted: '#968172',

  border: '#3D2F24',
  borderLight: '#2C221A',

  error: '#EF4444',
  errorLight: 'rgba(239, 68, 68, 0.16)',
  success: '#D97706',
  successLight: 'rgba(217, 119, 6, 0.16)',
  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.16)',
  info: '#93C5FD',
  infoLight: 'rgba(147, 197, 253, 0.16)',

  ecoGreen: '#D97706',
  ecoGreenLight: 'rgba(217, 119, 6, 0.16)',
  ecoGreenMid: '#F59E0B',
  gold: '#FBBF24',
  goldLight: 'rgba(251, 191, 36, 0.16)',

  glassBg: 'rgba(34, 27, 21, 0.94)',
  glassBorder: 'rgba(217, 119, 6, 0.35)',
  shadow: '#000000',
  tabBar: '#16110D',
  tabBarInactive: '#968172',
  statusBar: 'light',
};

// ==========================================
// 3. EMERALD NATURE THEME (Light & Dark)
// ==========================================
export const EmeraldNatureLightTheme = {
  name: 'emerald_nature',
  displayName: 'Emerald Nature',
  subtitle: 'Sustainable Tourism · Forest Mint & Warm Slate',
  mode: 'emerald_nature',
  isDark: false,

  primary: '#2E7D32',
  primaryDark: '#1B5E20',
  primaryLight: '#E8F5E9',
  primaryMid: '#388E3C',

  secondary: '#43A047',
  secondaryLight: '#C8E6C9',

  accent: '#F59E0B',
  accentLight: '#FEF3C7',

  background: '#F7F9F4',
  card: '#FFFFFF',
  cardSecondary: '#F1F7EF',
  surface: '#FFFFFF',
  surfaceElevated: '#FAFCF8',

  text: '#1A2E1A',
  textSecondary: '#4A6741',
  textMuted: '#8FAF8A',

  border: '#D5E8D0',
  borderLight: '#EAF4E7',

  error: '#D32F2F',
  errorLight: '#FFEBEE',
  success: '#2E7D32',
  successLight: '#E8F5E9',
  warning: '#E65100',
  warningLight: '#FFF3E0',
  info: '#1565C0',
  infoLight: '#E3F2FD',

  ecoGreen: '#2E7D32',
  ecoGreenLight: '#E8F5E9',
  ecoGreenMid: '#A5D6A7',
  gold: '#F59E0B',
  goldLight: '#FEF3C7',

  glassBg: 'rgba(255, 255, 255, 0.88)',
  glassBorder: 'rgba(213, 232, 208, 0.8)',
  shadow: '#1A2E1A',
  tabBar: '#FFFFFF',
  tabBarInactive: '#7A9E76',
  statusBar: 'dark',
};

export const EmeraldNatureDarkTheme = {
  name: 'emerald_nature',
  displayName: 'Emerald Nature (Dark)',
  subtitle: 'Obsidian OLED · Deep Black & Vibrant Emerald',
  mode: 'emerald_nature',
  isDark: true,

  primary: '#10B981',
  primaryDark: '#059669',
  primaryLight: 'rgba(16, 185, 129, 0.16)',
  primaryMid: '#34D399',

  secondary: '#34D399',
  secondaryLight: 'rgba(52, 211, 153, 0.16)',

  accent: '#F59E0B',
  accentLight: 'rgba(245, 158, 11, 0.16)',

  background: '#09090B',
  card: '#121215',
  cardSecondary: '#18181C',
  surface: '#121215',
  surfaceElevated: '#1E1E24',

  text: '#F4F4F5',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',

  border: '#27272A',
  borderLight: '#1E1E24',

  error: '#EF4444',
  errorLight: 'rgba(239, 68, 68, 0.16)',
  success: '#10B981',
  successLight: 'rgba(16, 185, 129, 0.16)',
  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.16)',
  info: '#3B82F6',
  infoLight: 'rgba(59, 130, 246, 0.16)',

  ecoGreen: '#10B981',
  ecoGreenLight: 'rgba(16, 185, 129, 0.16)',
  ecoGreenMid: '#059669',
  gold: '#F59E0B',
  goldLight: 'rgba(245, 158, 11, 0.16)',

  glassBg: 'rgba(18, 18, 21, 0.92)',
  glassBorder: 'rgba(39, 39, 42, 0.8)',
  shadow: '#000000',
  tabBar: '#09090B',
  tabBarInactive: '#71717A',
  statusBar: 'light',
};

// Aliases for compatibility
export const GlassHorizonTheme = GlassmorphismLightTheme;
export const VintageVoyagerTheme = VintageVoyagerLightTheme;
export const LightTheme = EmeraldNatureLightTheme;
export const DarkTheme = EmeraldNatureDarkTheme;

// Resolver function for Theme + Dark Mode Matrix
export const resolveTheme = (themeKey, isDark) => {
  switch (themeKey) {
    case 'vintage_voyager':
      return isDark ? VintageVoyagerDarkTheme : VintageVoyagerLightTheme;
    case 'emerald_nature':
    case 'light':
    case 'dark':
      return isDark ? EmeraldNatureDarkTheme : EmeraldNatureLightTheme;
    case 'glass_horizon':
    default:
      return isDark ? GlassmorphismDarkTheme : GlassmorphismLightTheme;
  }
};

// Curated 3 Design Themes for Theme Selection Modal
export const THEMES_LIST = [
  {
    id: 'glass_horizon',
    name: 'Glassmorphism Luxe',
    tagline: 'Frosted Glass · Deep Navy, Soft Blue & Warm Gold',
    badge: 'Premium Glass',
    theme: GlassmorphismLightTheme,
    primaryColor: '#1E3A5F',
    bgColor: '#E8F0F7',
    accentColor: '#C5A059',
    cardColor: 'rgba(255, 255, 255, 0.78)',
    icon: 'diamond-outline',
    description: 'Classic luxury frosted glass cards with thin white specular borders, deep navy typography, soft blue surfaces, and subtle warm gold accents.',
  },
  {
    id: 'vintage_voyager',
    name: 'Vintage Voyager',
    tagline: 'Heritage Cartography · Antique Maps & Modern Luxury',
    badge: 'Heritage Map',
    theme: VintageVoyagerLightTheme,
    primaryColor: '#B45309',
    bgColor: '#FAF6ED',
    accentColor: '#CA8A04',
    cardColor: '#FFFFFF',
    icon: 'compass-outline',
    description: 'Warm aged parchment, old-world navigation brass, antique leather tones, and refined luxury travel typography.',
  },
  {
    id: 'emerald_nature',
    name: 'Emerald Nature',
    tagline: 'Sustainable Tourism · Forest Mint & Warm Slate',
    badge: 'Classic Nature',
    theme: EmeraldNatureLightTheme,
    primaryColor: '#2E7D32',
    bgColor: '#F7F9F4',
    accentColor: '#F59E0B',
    cardColor: '#FFFFFF',
    icon: 'leaf-outline',
    description: 'Classic eco-tourism visual identity inspired by nature reserves and green travel.',
  },
];
