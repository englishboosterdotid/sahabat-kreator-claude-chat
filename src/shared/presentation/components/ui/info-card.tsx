import { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./card";

type Props = {
  title: string;
  description?: string;
  icon?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
};

export function InfoCard({
  title,
  description,
  icon,
  footer,
  children,
}: Props) {
  return (
    <Card>

      <CardHeader>

        <div className="flex items-center gap-3">

          {icon}

          <div>

            <CardTitle>
              {title}
            </CardTitle>

            {description && (
              <CardDescription>
                {description}
              </CardDescription>
            )}

          </div>

        </div>

      </CardHeader>

      {children && (
        <CardContent>

          {children}

        </CardContent>
      )}

      {footer && (
        <CardFooter>

          {footer}

        </CardFooter>
      )}

    </Card>
  );
}