import logo from '@/assets/icon-full.svg';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';

const logoVariants = cva('w-full object-contain', {
  variants: {
    variant: {
      default: 'h-9',
      small: 'h-6',
      medium: 'h-12',
      large: 'h-16',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface LogoProps
  extends React.HTMLAttributes<HTMLImageElement>,
    VariantProps<typeof logoVariants> {}

function Logo({ className, variant, ...props }: LogoProps) {
  return (
    <img
      className={cn(logoVariants({ variant }), className)}
      {...props}
      src={logo}
      alt='Keepr'
    />
  );
}

export { Logo, logoVariants };
