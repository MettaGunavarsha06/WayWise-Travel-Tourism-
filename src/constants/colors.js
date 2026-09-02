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
  subtitle: 'Dark Frosted Glass · Midnight Obsidian & Radiant Blue',
  mode: 'glass_horizon',
  isDark: true,

  // Primary: Radiant Indigo-Blue
  primary: '#4F75FF',
  primaryDark: '#3B82F6',
  primaryLight: 'rgba(79, 117, 255, 0.15)',
  primaryMid: '#6366F1',

  // Secondary: Sky Azure
  secondary: '#38BDF8',
  secondaryLight: 'rgba(56, 189, 248, 0.14)',

  // Accent: Warm Amber
  accent: '#F59E0B',
  accentLight: 'rgba(245, 158, 11, 0.16)',

  // Surfaces: Matte Obsidian & Dark Frosted Glass
  background: '#111216',
  card: '#191B22',
  cardSecondary: '#222530',
  surface: '#191B22',
  surfaceElevated: '#252834',

  // Text: Pure White & Slate Grey
  text: '#FFFFFF',
  textSecondary: '#8E95A5',
  textMuted: '#5F6677',

  // Borders: Subtle Clean Rim
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.04)',

  // Active Pill & Button Highlights
  activePill: '#FFFFFF',
  activePillText: '#111216',

  // Semantic
  error: '#EF4444',
  errorLight: 'rgba(239, 68, 68, 0.16)',
  success: '#10B981',
  successLight: 'rgba(16, 185, 129, 0.15)',
  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.16)',
  info: '#4F75FF',
  infoLight: 'rgba(79, 117, 255, 0.15)',

  ecoGreen: '#10B981',
  ecoGreenLight: 'rgba(16, 185, 129, 0.15)',
  ecoGreenMid: '#059669',
  gold: '#F59E0B',
  goldLight: 'rgba(245, 158, 11, 0.16)',

  // UI Chrome: Floating Dock
  glassBg: 'rgba(25, 27, 34, 0.92)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  shadow: '#000000',
  tabBar: '#191B22',
  tabBarInactive: '#8E95A5',
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

// ==========================================
// 4. LIQUID GLASS THEME (Light & Dark)
// ==========================================
export const LiquidGlassLightTheme = {
  name: 'liquid_glass',
  displayName: 'Liquid Glass',
  subtitle: 'Optical Refraction · Radiant Prismatic Gradients & Specular 3D',
  mode: 'liquid_glass',
  isDark: false,
  isGlass: true,
  isLiquidGlass: true,

  // Primary: Luminous Electric Cyan-Azure
  primary: '#0284C7',
  primaryDark: '#0369A1',
  primaryLight: 'rgba(2, 132, 199, 0.12)',
  primaryMid: '#0EA5E9',

  // Secondary: Radiant Prismatic Violet
  secondary: '#6366F1',
  secondaryLight: 'rgba(99, 102, 241, 0.12)',

  // Accent: Vivid Prismatic Magenta
  accent: '#EC4899',
  accentLight: 'rgba(236, 72, 153, 0.14)',

  // Surfaces: Ultra-Translucent Optical Liquid Glass
  background: '#EFF6FF',
  gradientBackground: ['#EFF6FF', '#F5F3FF', '#FDF2F8'],
  card: 'rgba(255, 255, 255, 0.72)',
  cardSecondary: 'rgba(255, 255, 255, 0.48)',
  surface: 'rgba(255, 255, 255, 0.76)',
  surfaceElevated: 'rgba(255, 255, 255, 0.90)',

  // Text: Clean Minimalist Obsidian Slate
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',

  // Borders: 3D Glossy Specular Highlight Rims
  border: 'rgba(255, 255, 255, 0.95)',
  borderLight: 'rgba(255, 255, 255, 0.60)',
  glassSpecular: 'rgba(255, 255, 255, 0.98)',
  glassHighlight: 'rgba(255, 255, 255, 0.85)',
  glassBorder: 'rgba(255, 255, 255, 0.95)',
  glassRefract: 'rgba(147, 197, 253, 0.40)',

  // Semantic
  error: '#F43F5E',
  errorLight: 'rgba(244, 63, 94, 0.12)',
  success: '#10B981',
  successLight: 'rgba(16, 185, 129, 0.12)',
  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.14)',
  info: '#0284C7',
  infoLight: 'rgba(2, 132, 199, 0.12)',

  ecoGreen: '#059669',
  ecoGreenLight: 'rgba(5, 150, 105, 0.12)',
  ecoGreenMid: '#10B981',
  gold: '#F59E0B',
  goldLight: 'rgba(245, 158, 11, 0.14)',

  // UI Chrome: Translucent Glass & Specular Glow
  glassBg: 'rgba(255, 255, 255, 0.72)',
  shadow: 'rgba(15, 23, 42, 0.12)',
  tabBar: 'rgba(255, 255, 255, 0.84)',
  tabBarInactive: '#64748B',
  statusBar: 'dark',
};

export const LiquidGlassDarkTheme = {
  name: 'liquid_glass',
  displayName: 'Liquid Glass (Dark)',
  subtitle: 'Obsidian Optical Glass · Iridescent Nebula & Specular Edges',
  mode: 'liquid_glass',
  isDark: true,
  isGlass: true,
  isLiquidGlass: true,

  // Primary: Luminous Electric Cyan-Azure in Dark Mode
  primary: '#38BDF8',
  primaryDark: '#0284C7',
  primaryLight: 'rgba(56, 189, 248, 0.18)',
  primaryMid: '#0EA5E9',

  // Secondary: Electric Lavender
  secondary: '#A78BFA',
  secondaryLight: 'rgba(167, 139, 250, 0.16)',

  // Accent: Radiant Neon Pink
  accent: '#F472B6',
  accentLight: 'rgba(244, 114, 182, 0.18)',

  // Surfaces: Deep Translucent Obsidian Optical Glass
  background: '#080C16',
  gradientBackground: ['#080C16', '#0F172A', '#130E26'],
  card: 'rgba(15, 23, 42, 0.72)',
  cardSecondary: 'rgba(30, 41, 59, 0.55)',
  surface: 'rgba(15, 23, 42, 0.78)',
  surfaceElevated: 'rgba(30, 41, 59, 0.85)',

  // Text: Luminous Minimalist Crystal Slate
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',

  // Borders: Refraction Lensing & Specular Edge
  border: 'rgba(255, 255, 255, 0.18)',
  borderLight: 'rgba(255, 255, 255, 0.10)',
  glassSpecular: 'rgba(255, 255, 255, 0.35)',
  glassHighlight: 'rgba(255, 255, 255, 0.22)',
  glassBorder: 'rgba(255, 255, 255, 0.20)',
  glassRefract: 'rgba(56, 189, 248, 0.25)',

  // Semantic
  error: '#FB7185',
  errorLight: 'rgba(251, 113, 133, 0.18)',
  success: '#34D399',
  successLight: 'rgba(52, 211, 153, 0.18)',
  warning: '#FBBF24',
  warningLight: 'rgba(251, 191, 36, 0.18)',
  info: '#38BDF8',
  infoLight: 'rgba(56, 189, 248, 0.18)',

  ecoGreen: '#34D399',
  ecoGreenLight: 'rgba(52, 211, 153, 0.18)',
  ecoGreenMid: '#10B981',
  gold: '#FBBF24',
  goldLight: 'rgba(251, 191, 36, 0.18)',

  // UI Chrome: Dark Liquid Glass
  glassBg: 'rgba(15, 23, 42, 0.72)',
  shadow: '#000000',
  tabBar: 'rgba(8, 13, 24, 0.90)',
  tabBarInactive: '#64748B',
  statusBar: 'light',
};

// Aliases for compatibility
export const LiquidGlassTheme = LiquidGlassLightTheme;
export const GlassHorizonTheme = GlassmorphismLightTheme;
export const VintageVoyagerTheme = VintageVoyagerLightTheme;
export const LightTheme = EmeraldNatureLightTheme;
export const DarkTheme = EmeraldNatureDarkTheme;

// Resolver function for Theme + Dark Mode Matrix
export const resolveTheme = (themeKey, isDark) => {
  switch (themeKey) {
    case 'liquid_glass':
      return isDark ? LiquidGlassDarkTheme : LiquidGlassLightTheme;
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

// Curated Design Themes for Theme Selection Modal
export const THEMES_LIST = [
  {
    id: 'liquid_glass',
    name: 'Liquid Glass',
    tagline: 'Optical Refraction · Radiant Prismatic Gradients & Specular 3D',
    badge: 'Liquid Glass',
    theme: LiquidGlassLightTheme,
    primaryColor: '#0284C7',
    bgColor: '#EFF6FF',
    accentColor: '#EC4899',
    cardColor: 'rgba(255, 255, 255, 0.72)',
    icon: 'water-outline',
    description: 'Ultra-translucent liquid glass with realistic optical refraction, 3D curved specular highlights, adaptive prismatic tinting, and luminous gradient depth.',
  },
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
