import { Platform, type TextStyle, type ViewStyle } from 'react-native';

/** Phone in the dark, lime mark on the night you pick. Sampled from the Upcoming Event mock. */
export const colors = {
  bg: '#161616',
  metal: '#161616',
  paper: '#161616',
  paperNav: '#161616',
  fg: '#FFFFFF',
  ink: '#FFFFFF',
  muted: '#8E8E93',
  subtle: '#C7C7C7',
  rule: 'rgba(255, 255, 255, 0.1)',
  highlighter: '#F2F862',
  mark: '#F2F862',
  navy: '#F2F862',
  white: '#FFFFFF',
  black: '#161616',
  overlay: 'rgba(22, 22, 22, 0.55)',
  overlayHeavy: 'rgba(22, 22, 22, 0.92)',
  accentFg: '#161616',
  card: '#222222',
  cardAlt: '#1A1A1A',
  cardBorder: '#2A2A2A',
  border: '#2A2A2A',
  line: 'rgba(255, 255, 255, 0.1)',
  neon: '#F2F862',
  neonHover: '#E8EE58',
  neonGlow: 'rgba(242, 248, 98, 0.28)',
  rose: '#FF4D7A',
  zinc900: '#161616',
  zinc800: '#222222',
  zinc700: '#3A3A3A',
  zinc500: '#8E8E93',
  zinc400: '#8E8E93',
  zinc300: '#C7C7C7',
  circle: '#282828',
} as const;

export const fonts = {
  display: 'Poppins_800ExtraBold',
  displayBlack: 'Poppins_800ExtraBold',
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  extrabold: 'Poppins_800ExtraBold',
  black: 'Poppins_800ExtraBold',
} as const;

export const radius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 24,
  full: 999,
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 48,
} as const;

export const layout = {
  sheetMax: 1120,
  railWidth: 148,
  railWidthCompact: 88,
  desktop: 900,
  weekendMax: 640,
} as const;

export const paperShadow = Platform.select({
  web: {
    boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
  },
  default: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 10,
  },
}) as ViewStyle;

export const hitSlop = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
};

export const MIN_TOUCH = 44;

export const webCursor: ViewStyle | undefined =
  Platform.OS === 'web' ? ({ cursor: 'pointer' } as ViewStyle) : undefined;

export const type = {
  display: {
    fontFamily: fonts.displayBlack,
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -0.4,
    color: colors.fg,
  },
  hour: {
    fontFamily: fonts.displayBlack,
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -0.4,
    color: colors.fg,
  },
  section: {
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.3,
    color: colors.fg,
  },
  wordmark: {
    fontFamily: fonts.bold,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: 0.2,
    color: colors.fg,
  },
  heroPrice: {
    fontFamily: fonts.bold,
    fontSize: 22,
    lineHeight: 24,
    color: colors.highlighter,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.2,
    color: colors.fg,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: colors.subtle,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.fg,
  },
  meta: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },
  overline: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  button: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  nav: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    color: colors.fg,
  },
} as const satisfies Record<string, TextStyle>;
