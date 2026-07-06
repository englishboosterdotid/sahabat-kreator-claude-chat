import { cn } from "@/shared/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement>;

export function Stack({
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        "space-y-4",
        className
      )}
      {...props}
    />
  );
}