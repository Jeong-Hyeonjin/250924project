import { type ClassValue, clsx } from "clsx";
import { cva } from "class-variance-authority";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl",
        outline: "border border-emerald-600 text-emerald-600 hover:bg-emerald-50",
        ghost: "text-emerald-600 hover:bg-emerald-50",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-9 px-4",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
