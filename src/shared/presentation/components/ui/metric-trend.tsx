import {
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

import { Badge } from "./badge";

type Props = {
  value: number;
};

export function MetricTrend({
  value,
}: Props) {
  const positive = value >= 0;
  return (
    <Badge
      dot
      size="sm"
      variant={
        positive
          ? "success"
          : "danger"
      }
      icon={
        positive
          ? <ArrowUpRight className="size-3"/>
          : <ArrowDownRight className="size-3"/>
      }
    >
      {positive ? "+" : ""}
      {value.toFixed(1)}%
    </Badge>
  );
}