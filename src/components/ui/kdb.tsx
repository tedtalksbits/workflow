{
  /* <kbd className='ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border-foreground bg-foreground/30 px-1.5 font-mono text-[10px] font-medium text-foreground opacity-100'>
            <span className='text-[10px]'>⌘</span>N
          </kbd> */
}

import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';

const kdbVariants = cva(
  'pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded px-1.5 font-mono text-[10px] font-medium',
  {
    variants: {
      variant: {
        default:
          'border-foreground bg-foreground/30 text-foreground opacity-100',
        destructive:
          'border-destructive bg-destructive/30 text-destructive-foreground opacity-100',
        secondary:
          'border-secondary bg-secondary/30 text-secondary-foreground opacity-100',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface KdbProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof kdbVariants> {}

function Kdb({ className, variant, ...props }: KdbProps) {
  return <kbd className={cn(kdbVariants({ variant }), className)} {...props} />;
}

export { Kdb, kdbVariants };
