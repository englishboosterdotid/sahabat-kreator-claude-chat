import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/presentation/components/ui/card";

type Props = {
  title: string;
  icon: React.ReactNode;
  count: number;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function PlatformCard({
  title,
  icon,
  count,
  children,
  footer,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-accent">
            {icon}
          </div>

          <div>
            <CardTitle>{title}</CardTitle>

            <CardDescription>
              {count} Connected Account
              {count !== 1 && "s"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {children}
      </CardContent>

      {footer && (
        <CardFooter>
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}