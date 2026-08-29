// WayWise Design System — Color Tokens
// Tourism + Sustainability Identity
// Primary: Deep Forest Green | Accent: Warm Amber (used sparingly)

export const LightTheme = {
  mode: 'light',

  // === Primary Brand: Forest Green ===
  primary: '#2E7D32',        // Medium forest green — buttons, active states
  primaryDark: '#1B5E20',    // Deep forest green — emphasis
  primaryLight: '#E8F5E9',   // Soft mint — backgrounds, chips
  primaryMid: '#388E3C',     // Mid green — hover states

  // === Secondary Greens ===
  secondary: '#43A047',      // Fresh green — secondary actions
  secondaryLight: '#C8E6C9', // Light green — subtle backgrounds

  // === Accent (Warm Amber — use sparingly) ===
  accent: '#F59E0B',
  accentLight: '#FEF3C7',

  // === Backgrounds & Surfaces ===
  background: '#F7F9F4',     // Warm off-white with green tint
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
  borderLight: '#EAF4E7',    // Very subtle border

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
  tabBarInactive: '#7A9E76',  // Muted green-gray — not disabled-looking
  statusBar: 'dark',
};

export const DarkTheme = {
  mode: 'dark',

  // === Primary Brand: Vibrant Emerald / Forest (Clean on black background) ===
  primary: '#10B981',        // Vibrant emerald green — buttons, active states
  primaryDark: '#059669',    // Deep emerald green — emphasis
  primaryLight: 'rgba(16, 185, 129, 0.16)', // Subtle emerald tint for chips/badges
  primaryMid: '#34D399',     // Mid emerald

  // === Secondary ===
  secondary: '#34D399',      // Fresh light emerald
  secondaryLight: 'rgba(52, 211, 153, 0.16)',

  // === Accent ===
  accent: '#F59E0B',
  accentLight: 'rgba(245, 158, 11, 0.16)',

  // === Backgrounds & Surfaces (Pure Black & Neutral Charcoal) ===
  background: '#09090B',     // Deep obsidian black
  card: '#121215',           // Dark neutral card surface
  cardSecondary: '#18181C',  // Secondary dark surface
  surface: '#121215',
  surfaceElevated: '#1E1E24',

  // === Text (Clean Neutral Grays & Whites) ===
  text: '#F4F4F5',           // Crisp near-white
  textSecondary: '#A1A1AA',  // Clean neutral light gray
  textMuted: '#71717A',      // Muted neutral gray

  // === Borders ===
  border: '#27272A',         // Clean subtle border
  borderLight: '#1E1E24',    // Very subtle border

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
