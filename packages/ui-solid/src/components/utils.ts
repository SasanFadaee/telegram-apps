import type { MergeProps } from 'solid-js';
import { mergeProps } from 'solid-js';

import type { ColorScheme, Platform } from '~/types/known.js';

/**
 * Merges specified properties prepending default color scheme and platform.
 * @param sources - properties to merge.
 */
export function mergeWithConfigDefaults<T extends unknown[]>(
  ...sources: T
): MergeProps<[{ colorScheme: ColorScheme, platform: Platform }, ...T]> {
  return mergeProps({
    colorScheme: 'light',
    platform: 'base',
  } as const, ...sources);
}
