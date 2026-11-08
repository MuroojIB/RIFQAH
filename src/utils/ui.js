import { cva } from 'class-variance-authority'

// Pill button — shared across the app
export const pill = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        ink: 'bg-foreground text-background hover:bg-foreground/85',
        outline: 'border border-foreground/80 bg-card text-foreground hover:bg-muted',
        ghost: 'text-foreground hover:bg-foreground/5',
        soft: 'bg-accent text-accent-foreground hover:bg-accent/80',
        danger: 'border border-destructive/40 bg-card text-destructive hover:bg-destructive/10',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-5 text-sm',
        lg: 'h-13 px-7 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

// Shared input field style — generous height and line-height for Arabic descenders
export const fieldClass =
  'h-12 w-full rounded-2xl border border-input bg-card px-4 text-base leading-normal outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 aria-invalid:border-destructive disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground'

