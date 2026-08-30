import { Platform, type TextStyle, type ViewStyle } from 'react-native';

/** Night out in Konstanz: phone in the dark, club photos, one hot mark. */
export const colors = {
  bg: '#0B0A0D',
  metal: '#0B0A0D',
  paper: '#141218',
  paperNav: '#121016',
  fg: '#F6F1EA',
  ink: '#F6F1EA',
  muted: '#A39B96',
  subtle: '#C9C2BB',
  rule: 'rgba(246, 241, 234, 0.12)',
  highlighter: '#E8FF4A',
  mark: '#E8FF4A',
  navy: '#E8FF4A',
  white: '#F6F1EA',
  black: '#0B0A0D',
  overlay: 'rgba(11, 10, 13, 0.55)',
  accentFg: '#0B0A0D',
  card: '#16141C',
  cardAlt: '#1C1822',
  cardBorder: 'rgba(246, 241, 234, 0.1)',
  border: 'rgba(246, 241, 234, 0.12)',
  line: 'rgba(246, 241, 234, 0.12)',
  neon: '#E8FF4A',
  neonHover: '#D6F03A',
  neonGlow: 'rgba(232, 255, 74, 0.28)',
  rose: '#FF4D7A',
  zinc900: '#121016',
  zinc800: '#1C1822',
  zinc700: '#3A3540',
  zinc500: '#A39B96',
  zinc400: '#A39B96',
  zinc300: '#C9C2BB',
} as const;

export const fonts = {
  display: 'BarlowCondensed_700Bold',
  displayBlack: 'BarlowCondensed_800ExtraBold',
  regular: 'Barlow_400Regular',
  medium: 'Barlow_500Medium',
  semibold: 'Barlow_600SemiBold',
  bold: 'Barlow_700Bold',
  extrabold: 'Barlow_700Bold',
  black: 'BarlowCondensed_800ExtraBold',
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
    fontSize: 48,
    lineHeight: 48,
    letterSpacing: -0.4,
    color: colors.fg,
  },
  hour: {
    fontFamily: fonts.displayBlack,
    fontSize: 36,
    lineHeight: 36,
    letterSpacing: -0.4,
    color: colors.fg,
  },
  section: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: 0.4,
    color: colors.fg,
  },
  wordmark: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 24,
    letterSpacing: 1.6,
    color: colors.fg,
  },
  heroPrice: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 24,
    color: colors.highlighter,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 17,
    lineHeight: 22,
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
    letterSpacing: 0.3,
  },
  nav: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    color: colors.fg,
  },
} as const satisfies Record<string, TextStyle>;
