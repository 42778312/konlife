import { useWindowDimensions } from 'react-native';
import { layout } from '@/constants/theme';

export function useBreakpoint() {
  const { width } = useWindowDimensions();
  const desktop = width >= layout.desktop;
  return { width, desktop, phone: !desktop };
}
