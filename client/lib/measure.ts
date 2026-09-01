import type { RefObject } from 'react';
import type { View } from 'react-native';
import type { SourceRect } from '@/lib/eventMotion';

export function measureView(
  ref: RefObject<View | null>,
  radius: number,
): Promise<SourceRect | null> {
  return new Promise((resolve) => {
    const node = ref.current;
    if (!node) {
      resolve(null);
      return;
    }
    node.measureInWindow((x, y, width, height) => {
      if (!width || !height) {
        resolve(null);
        return;
      }
      resolve({ x, y, width, height, radius });
    });
  });
}
