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

  // === Primary Brand: Forest Green (brighter for dark bg) ===
  primary: '#4CAF50',
  primaryDark: '#2E7D32',
  primaryLight: '#1B3A1B',
  primaryMid: '#43A047',

  // === Secondary Greens ===
  secondary: '#66BB6A',
  secondaryLight: '#1B3A1B',

  // === Accent ===
  accent: '#FBBF24',
  accentLight: '#3D2A00',

  // === Backgrounds & Surfaces ===
  background: '#0D1A0D',     // Very dark green-black
  card: '#162316',
  cardSecondary: '#1C2E1C',
  surface: '#1C2E1C',
  surfaceElevated: '#1F321F',

  // === Text ===
  text: '#E8F5E9',
  textSecondary: '#A5C8A0',
  textMuted: '#5A7A57',

  // === Borders ===
  border: '#2A4A2A',
  borderLight: '#1C2E1C',

  // === Semantic Colors ===
  error: '#EF5350',
  errorLight: '#3B0000',
  success: '#66BB6A',
  successLight: '#1B3A1B',
  warning: '#FFA726',
  warningLight: '#3D2000',
  info: '#42A5F5',
  infoLight: '#0D1E3D',

  // === Eco / Sustainability ===
  ecoGreen: '#66BB6A',
  ecoGreenLight: '#1B3A1B',
  ecoGreenMid: '#2E5C2E',

  // === UI Chrome ===
  glassBg: 'rgba(22, 35, 22, 0.88)',
  glassBorder: 'rgba(42, 74, 42, 0.8)',
  shadow: '#000000',
  tabBar: '#101A10',
  tabBarInactive: '#4A6A47',
  statusBar: 'light',
};
