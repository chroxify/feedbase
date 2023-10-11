import * as React from 'react';
import { cn } from '@ui/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'border-input bg-background ring-offset-root placeholder:text-foreground/50 focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-2 text-sm font-extralight transition-shadow duration-200 file:border-0  file:bg-transparent file:text-sm file:font-medium placeholder:font-extralight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
