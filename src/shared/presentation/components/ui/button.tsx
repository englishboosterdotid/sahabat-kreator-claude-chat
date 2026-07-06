import { cn } from "@/shared/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonVariant =
  | "default"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";

type ButtonSize =
  | "sm"
  | "md"
  | "lg"
  | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      isLoading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all",
          "disabled:pointer-events-none disabled:opacity-50",

          // size
          size === "sm" && "h-9 px-3 text-sm",
          size === "md" && "h-10 px-4 text-sm",
          size === "lg" && "h-11 px-6 text-base",
          size === "icon" && "size-10",

          // variants
          variant === "default" &&
            "bg-primary text-primary-foreground shadow-sm hover:opacity-90",

          variant === "secondary" &&
            "bg-secondary text-secondary-foreground hover:opacity-90",

          variant === "outline" &&
            "border border-border bg-background hover:bg-accent",

          variant === "ghost" &&
            "hover:bg-accent",

          variant === "destructive" &&
            "bg-destructive text-destructive-foreground hover:opacity-90",

          className
        )}
        {...props}
      >
        {isLoading ? "Memproses..." : children}
      </button>
    );
  }
);

Button.displayName = "Button";