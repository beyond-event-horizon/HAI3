/**
 * File handling utilities for chat screenset
 * Business logic extracted from UI components per UIKIT.md guidelines
 */

import type { AttachedFile } from '../types';

/**
 * Convert browser File object to AttachedFile type
 */
export const createAttachedFile = (file: File): AttachedFile => {
  return {
    id: `file-${Date.now()}`,
    name: file.name,
    size: file.size,
    type: file.type,
    path: URL.createObjectURL(file),
  };
};

/**
 * Format file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

/**
 * Get file icon type based on MIME type
 */
export type FileIconType = 'image' | 'document' | 'generic';

export const getFileIconType = (mimeType: string): FileIconType => {
  if (mimeType.startsWith('image/')) {
    return 'image';
  }
  if (mimeType.includes('pdf') || mimeType.includes('document')) {
    return 'document';
  }
  return 'generic';
};
