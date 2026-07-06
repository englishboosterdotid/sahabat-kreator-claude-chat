import { cn } from "@/shared/lib/utils";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type HeadingProps = React.HTMLAttributes<HTMLHeadingElement>;

export function Card({
  className,
  ...props
}: DivProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: DivProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b border-border p-6",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: DivProps) {
  return (
    <div
      className={cn(
        "p-6",
        className
      )}
      {...props}
    />
  );
}

export function CardFooter({
  className,
  ...props
}: DivProps) {
  return (
    <div
      className={cn(
        "border-t border-border p-6",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: HeadingProps) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "mt-1 text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}