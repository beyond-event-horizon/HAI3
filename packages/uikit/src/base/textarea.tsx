import * as React from "react"
import { cn } from "../lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Enable auto-resize behavior (adjusts height based on content)
   */
  autoResize?: boolean;
  /**
   * Minimum height in pixels when auto-resize is enabled (default: 50)
   */
  minHeight?: number;
  /**
   * Maximum height in pixels when auto-resize is enabled (default: 350)
   */
  maxHeight?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize = false, minHeight = 50, maxHeight = 350, onChange, ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement>(null);
    
    // Merge external ref with internal ref
    React.useImperativeHandle(ref, () => internalRef.current as HTMLTextAreaElement);

    const handleResize = React.useCallback(() => {
      if (autoResize && internalRef.current) {
        const textarea = internalRef.current;
        // Reset height to get accurate scrollHeight
        textarea.style.height = 'auto';
        // Calculate the actual content height
        const scrollHeight = textarea.scrollHeight;
        // Set height with constraints
        textarea.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
      }
    }, [autoResize, minHeight, maxHeight]);

    // Auto-resize on mount and value changes
    React.useEffect(() => {
      handleResize();
    }, [handleResize, props.value]);

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        handleResize();
        onChange?.(e);
      },
      [onChange, handleResize]
    );

    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={internalRef}
        onChange={handleChange}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
