import { cn } from "@/shared/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement>;

export function ContentGrid({
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3",
        className
      )}
      {...props}
    />
  );
}