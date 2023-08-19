import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import React from 'react';

const zoneVariants = cva(
  'p-4 rounded-xl transition-colors duration-300 ease-in-out',
  {
    variants: {
      variant: {
        default:
          'bg-foreground/10 text-foreground border-foreground border hover:bg-foreground/20',
        destructive:
          'bg-destructive/10 text-destructive-foreground border-destructive border hover:bg-destructive/20 ',
        success:
          'bg-success/10 text-success-foreground border-success border hover:bg-success/20',
        warning:
          'bg-warning/10 text-warning-foreground border-warning border hover:bg-warning/20',
      },
    },
  }
);

export interface ZoneProps extends React.ComponentPropsWithoutRef<'div'> {
  variant?: 'default' | 'destructive' | 'success' | 'warning';
}

const Zone = React.forwardRef<HTMLDivElement, ZoneProps>(
  (
    { className, variant, children, ...props },
    ref: React.Ref<HTMLDivElement>
  ) => (
    <div
      ref={ref}
      className={cn(zoneVariants({ variant, className }))}
      {...props}
    >
      {children}
    </div>
  )
);

// export interface ZoneActionProps
//   extends React.ComponentPropsWithoutRef<'button'> {
//   variant?: 'default' | 'destructive' | 'success' | 'warning';
// }
// const ZoneAction = React.forwardRef<HTMLButtonElement, ZoneActionProps>(
//   ({ className, variant, ...props }, ref) => (
//     <Button
//       ref={ref}
//       className={cn('bg-destructive', { variant, className })}
//       {...props}
//     />
//   )
// );

// const ZoneContent = React.forwardRef<HTMLDivElement, ZoneProps>(
//   (
//     { className, variant, children, ...props },
//     ref: React.Ref<HTMLDivElement>
//   ) => (
//     <div
//       ref={ref}
//       className={cn('', zoneVariants({ variant, className }))}
//       {...props}
//     >
//       {children}
//     </div>
//   )
// );
// const ZoneHeader = React.forwardRef<HTMLDivElement, ZoneProps>(
//   (
//     { className, variant, children, ...props },
//     ref: React.Ref<HTMLDivElement>
//   ) => (
//     <div
//       ref={ref}
//       className={cn(
//         'flex items-center justify-between gap-4',
//         zoneVariants({ variant, className })
//       )}
//       {...props}
//     >
//       {children}
//     </div>
//   )
// );

// const ZoneTitle = React.forwardRef<HTMLHeadingElement, ZoneProps>(
//   (
//     { className, variant, children, ...props },
//     ref: React.Ref<HTMLHeadingElement>
//   ) => (
//     <h3
//       ref={ref}
//       className={cn(
//         'flex items-center justify-between gap-4',
//         zoneVariants({ variant, className })
//       )}
//       {...props}
//     >
//       {children}
//     </h3>
//   )
// );

// const ZoneDescription = React.forwardRef<HTMLParagraphElement, ZoneProps>(
//   (
//     { className, variant, children, ...props },
//     ref: React.Ref<HTMLParagraphElement>
//   ) => (
//     <p
//       ref={ref}
//       className={cn(
//         'flex items-center justify-between gap-4',
//         zoneVariants({ variant, className })
//       )}
//       {...props}
//     >
//       {children}
//     </p>
//   )
// );

export { Zone };
