import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./card";

type ChartCardProps = {
  title: string;
  description?: string;
  toolbar?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export function ChartCard({
  title,
  description,
  toolbar,
  footer,
  children,
}: ChartCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex min-w-0 flex-1 flex-col">
          <CardTitle>{title}</CardTitle>

          {description && (
            <CardDescription>
              {description}
            </CardDescription>
          )}
        </div>

        {toolbar}
      </CardHeader>

      <CardContent>{children}</CardContent>

      {footer}
    </Card>
  );
}