import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Footer component for HAI3 UI-Core
 * Provides a consistent footer layout across all screens
 */

export interface FooterProps {
  className?: string;
  children?: React.ReactNode;
  copyright?: string;
  links?: Array<{ label: string; href: string }>;
}

export const Footer: React.FC<FooterProps> = ({
  className,
  children,
  copyright,
  links,
}) => {
  return (
    <footer
      className={cn(
        'flex items-center justify-between px-6 py-3',
        'bg-background border-t border-border',
        'h-12 w-full',
        'text-sm text-muted-foreground',
        className
      )}
    >
      <div className="flex items-center gap-4">
        {copyright && <span>{copyright}</span>}
        {links && (
          <nav className="flex gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
      {children}
    </footer>
  );
};

Footer.displayName = 'Footer';
