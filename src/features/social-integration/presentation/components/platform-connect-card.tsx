import { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  accountCount: number;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function PlatformConnectCard({
  icon,
  title,
  accountCount,
  children,
  footer,
}: Props) {
  return (
    <section
      className="
        flex
        h-full
        flex-col
        rounded-2xl
        border
        border-border
        bg-card
        shadow-sm
        transition-all
        duration-200
        hover:shadow-md
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-accent">
            {icon}
          </div>

          <div>
            <h3 className="font-semibold text-card-foreground">
              {title}
            </h3>

            <p className="text-xs text-muted-foreground">
              {accountCount} account{accountCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Account List */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {children}
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4">
        {footer}
      </div>
    </section>
  );
}