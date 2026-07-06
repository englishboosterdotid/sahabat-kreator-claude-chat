import { ArrowRight } from "lucide-react";

import { Card } from "./card";

type Props = {
  title: string;
  description: string;
  icon: React.ReactNode;
  color?: string;
  onClick?: () => void;
};

export function ActionCard({
  title,
  description,
  icon,
  color,
  onClick,
}: Props) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <div
            className="flex size-11 items-center justify-center rounded-xl bg-accent"
            style={{
              color,
            }}
          >
            {icon}
          </div>

          <div>

            <p className="font-semibold">
              {title}
            </p>

            <p className="text-sm text-muted-foreground">
              {description}
            </p>

          </div>

        </div>

        <ArrowRight className="size-5 text-muted-foreground" />

      </div>
    </Card>
  );
}