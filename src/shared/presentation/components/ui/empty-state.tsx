import { ReactNode } from "react";

import { Button } from "./button";

type Props = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
  };
};

export function EmptyState({
  icon,
  title,
  description,
  action,
}: Props) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card p-10 text-center">

      {icon && (
        <div className="mb-4 text-primary">
          {icon}
        </div>
      )}

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {action && (
        <Button
          className="mt-6 w-auto"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}