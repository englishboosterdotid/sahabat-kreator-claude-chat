import { cn } from "@/shared/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type BadgeVariant =
  | "default"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "outline";

type BadgeSize =
  | "sm"
  | "md";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: ReactNode;
}

export function Badge({
  variant = "default",
  size = "md",
  dot = false,
  icon,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap transition-colors",

        size === "sm" && "px-2 py-0.5 text-[11px]",

        size === "md" && "px-3 py-1 text-xs",

        variant === "default" &&
          "border-primary/20 bg-primary/10 text-primary",

        variant === "secondary" &&
          "border-secondary/20 bg-secondary/10 text-secondary",

        variant === "success" &&
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",

        variant === "warning" &&
          "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",

        variant === "danger" &&
          "border-destructive/20 bg-destructive/10 text-destructive",

        variant === "outline" &&
          "bg-transparent border-border text-foreground",

        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "size-2 rounded-full",

            variant === "success" && "bg-emerald-500",

            variant === "warning" && "bg-amber-500",

            variant === "danger" && "bg-destructive",

            variant === "default" && "bg-primary",

            variant === "secondary" && "bg-secondary",

            variant === "outline" && "bg-foreground"
          )}
        />
      )}

      {icon}

      {children}
    </span>
  );
}