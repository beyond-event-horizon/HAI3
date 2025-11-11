/**
 * FileAttachment - File attachment UI components
 * Handles file selection, preview, and display
 */

import React, { useRef } from 'react';
import { Paperclip, X, File, Image, FileText } from 'lucide-react';
import type { AttachedFile } from '../../types';

export interface FileAttachmentButtonProps {
  onFileSelect: (file: AttachedFile) => void;
  disabled?: boolean;
  className?: string;
}

export const FileAttachmentButton: React.FC<FileAttachmentButtonProps> = ({
  onFileSelect,
  disabled = false,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const attachedFile: AttachedFile = {
      id: `file-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      path: URL.createObjectURL(file),
    };

    onFileSelect(attachedFile);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        className={`p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-50 ${className}`}
        title="Attach file"
      >
        <Paperclip size={16} />
      </button>
    </>
  );
};

export interface FileAttachmentPreviewProps {
  files: AttachedFile[];
  onRemove: (fileId: string) => void;
  className?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) {
    return <Image size={20} className="text-blue-500" />;
  }
  if (type.includes('pdf') || type.includes('document')) {
    return <FileText size={20} className="text-red-500" />;
  }
  return <File size={20} className="text-gray-500" />;
};

export const FileAttachmentPreview: React.FC<FileAttachmentPreviewProps> = ({
  files,
  onRemove,
  className = '',
}) => {
  if (files.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-border"
        >
          <div className="text-muted-foreground flex-shrink-0">
            {getFileIcon(file.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{file.name}</div>
            <div className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
            </div>
          </div>
          <button
            onClick={() => onRemove(file.id)}
            className="p-1 hover:bg-background rounded-lg transition-colors text-muted-foreground hover:text-foreground flex-shrink-0"
            title="Remove file"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export interface MessageFileDisplayProps {
  files: AttachedFile[];
  className?: string;
}

export const MessageFileDisplay: React.FC<MessageFileDisplayProps> = ({
  files,
  className = '',
}) => {
  if (!files || files.length === 0) return null;

  return (
    <div className={`mt-3 space-y-2 ${className}`}>
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border"
        >
          <div className="text-muted-foreground flex-shrink-0">
            {getFileIcon(file.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{file.name}</div>
            <div className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
