import React from 'react';
import { cn } from '../../lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '../../base/avatar';
import { Skeleton } from '../../base/skeleton';

/**
 * User Info Props
 * Matches UI Core contract in uikitContracts.ts
 */
export interface UserInfoProps {
  displayName?: string;
  email?: string;
  avatarUrl?: string;
  className?: string;
  loading?: boolean;
}

/**
 * UserInfo Component
 * Composite component combining shadcn Avatar + text
 * Displays user avatar with fallback initials and name/email
 */
export const UserInfo = React.forwardRef<HTMLDivElement, UserInfoProps>(
  ({ displayName, email, avatarUrl, className, loading }, ref) => {
    const getInitials = (): string => {
      if (!displayName) return email?.charAt(0).toUpperCase() || '?';
      const parts = displayName.trim().split(/\s+/);
      if (parts.length >= 2) {
        return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
      }
      return displayName.substring(0, 2).toUpperCase();
    };

    const initials = getInitials();
    const displayText = displayName || email || 'User';
    
    if (loading) {
      return (
        <div ref={ref} className={cn('flex items-center gap-2 text-sm', className)}>
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      );
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 text-sm text-muted-foreground',
          className
        )}
      >
        <Avatar className="h-8 w-8">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={displayText} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span>{displayText}</span>
      </div>
    );
  }
);

UserInfo.displayName = 'UserInfo';
