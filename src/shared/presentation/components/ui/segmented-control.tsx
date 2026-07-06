import { cn } from "@/shared/lib/utils";

type Option = {
  label: string;
  value: string;
};

type Props = {
  value: string;
  options: Option[];
  onChange?: (value: string) => void;
};

export function SegmentedControl({
  value,
  options,
  onChange,
}: Props) {
  return (
    <div className="inline-flex rounded-xl border border-border bg-muted p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange?.(option.value)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm transition",
            value === option.value
              ? "bg-card shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}