import { screensetService } from '@/core/screensets/screensetService';
import type { ScreensetOption } from './footerSlice';

/**
 * All possible screenset categories
 */
const ALL_CATEGORIES = ['drafts', 'mockups', 'production'];

/**
 * Build screenset options for footer selector
 * Returns all categories, even if empty (muted in UI)
 */
export const buildScreensetOptions = (): ScreensetOption[] => {
  return ALL_CATEGORIES.map((category) => ({
    category,
    screensets: screensetService.getMetadataByCategory(category),
  }));
};
