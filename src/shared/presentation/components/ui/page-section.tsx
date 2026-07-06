import { cn } from "@/shared/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement>;

export function PageSection({
  className,
  ...props
}: Props) {
  return (
    <section
      className={cn(
        "space-y-6",
        className
      )}
      {...props}
    />
  );
}