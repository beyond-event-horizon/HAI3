import React from 'react';
import { cn } from '../../lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '../../base/avatar';

/**
 * User Info Props
 */
export interface UserInfoProps {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  className?: string;
}

/**
 * UserInfo Component
 * Composite component combining shadcn Avatar + text
 * Displays user avatar with fallback initials and full name
 */
export const UserInfo = React.forwardRef<HTMLDivElement, UserInfoProps>(
  ({ firstName, lastName, avatarUrl, className }, ref) => {
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 text-sm text-muted-foreground',
          className
        )}
      >
        <Avatar className="h-8 w-8">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={`${firstName} ${lastName}`} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span>
          {firstName} {lastName}
        </span>
      </div>
    );
  }
);

UserInfo.displayName = 'UserInfo';
