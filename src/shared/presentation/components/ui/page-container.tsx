import { cn } from "@/shared/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement>;

export function PageContainer({
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl space-y-8",
        className
      )}
      {...props}
    />
  );
}