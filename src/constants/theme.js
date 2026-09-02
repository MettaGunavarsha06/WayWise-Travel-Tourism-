// WayWise Centralized Theme Utilities
// Shared spacing, border radii, shadows, and card styles

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const Radii = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  pill: 100,
};

export const Shadows = {
  // Subtle shadow for cards
  card: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  // High-fidelity liquid glass shadow with soft multi-layer diffusion
  liquidGlass: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },
  // More prominent shadow for floating elements
  float: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 5,
  },
  // Light border-shadow for subtle depth
  subtle: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
};

// Reusable card style factory — call with theme colors
export const makeCardStyle = (theme) => {
  const isLiquid = theme?.isLiquidGlass || theme?.mode === 'liquid_glass';
  return {
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderWidth: isLiquid ? 1.5 : 1,
    borderRadius: isLiquid ? Radii.xl : Radii.lg,
    ...(isLiquid ? Shadows.liquidGlass : Shadows.card),
    shadowColor: theme.shadow,
  };
};
