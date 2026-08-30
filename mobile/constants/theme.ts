export const colors = {
  bg: '#080809',
  fg: '#F4F4F5',
  card: '#141417',
  cardAlt: '#1a1a1f',
  cardBorder: '#27272A',
  border: 'rgba(39, 39, 42, 0.8)',
  zinc900: '#18181B',
  zinc800: '#27272A',
  zinc700: '#3F3F46',
  zinc500: '#71717A',
  zinc400: '#A1A1AA',
  zinc300: '#D4D4D8',
  neon: '#CCFF00',
  neonHover: '#b8e600',
  neonGlow: 'rgba(204, 255, 0, 0.2)',
  rose: '#F43F5E',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const fonts = {
  display: 'BebasNeue_400Regular',
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
  black: 'Inter_900Black',
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  full: 999,
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
} as const;

export const hitSlop = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
};

export const MIN_TOUCH = 44;
