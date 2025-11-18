/**
 * Formatting utilities for chat screenset
 * Business logic extracted from UI components per UIKIT.md guidelines
 */

/**
 * Format timestamp for display in chat list
 * Shows relative time for recent messages, date for older ones
 * 
 * @param date - The date to format
 * @param tk - Translation function for 'just_now' key
 * @returns Formatted timestamp string
 */
export const formatTimestamp = (date: Date, tk?: (key: string) => string): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return tk ? tk('just_now') : 'just now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString();
};
