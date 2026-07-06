import { ReactNode } from "react";

import {
  Card,
  CardContent,
} from "./card";

import { cn } from "@/shared/lib/utils";

type Props = {
  title: string;
  value: ReactNode;

  icon?: ReactNode;
  subtitle?: ReactNode;

  trend?: ReactNode;

  footer?: ReactNode;

  className?: string;
};

export function StatCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  footer,
  className,
}: Props) {
  return (
    <Card
      className={cn(
        "h-full",
        className
      )}
    >
      <CardContent className="flex h-full flex-col">

        <div className="flex items-start justify-between">

          <div className="min-w-0">

            <p className="text-sm text-muted-foreground">
              {title}
            </p>

            {subtitle && (
              <p className="mt-0.5 text-xs text-muted-foreground/70">
                {subtitle}
              </p>
            )}

            <h3 className="mt-2 truncate text-3xl font-bold tracking-tight">
              {value}
            </h3>

          </div>

          {icon && (
            <div className="rounded-xl bg-accent p-3">
              {icon}
            </div>
          )}

        </div>

        {(trend || footer) && (

          <div className="mt-auto pt-6 flex items-center justify-between">

            {footer}

            {trend}

          </div>

        )}

      </CardContent>
    </Card>
  );
}