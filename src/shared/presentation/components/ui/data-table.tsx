import { cn } from "@/shared/lib/utils";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type TableProps = React.TableHTMLAttributes<HTMLTableElement>;
type CellProps = React.TdHTMLAttributes<HTMLTableCellElement>;
type HeaderCellProps = React.ThHTMLAttributes<HTMLTableCellElement>;
type RowProps = React.HTMLAttributes<HTMLTableRowElement>;

export function DataTable({
  className,
  ...props
}: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table
        className={cn(
          "w-full border-collapse text-sm",
          className
        )}
        {...props}
      />
    </div>
  );
}

export function DataTableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "border-b border-border bg-muted/50",
        className
      )}
      {...props}
    />
  );
}

export function DataTableBody(
  props: React.HTMLAttributes<HTMLTableSectionElement>
) {
  return <tbody {...props} />;
}

export function DataTableRow({
  className,
  ...props
}: RowProps) {
  return (
    <tr
      className={cn(
        "border-b border-border transition-colors hover:bg-accent/40",
        className
      )}
      {...props}
    />
  );
}

export function DataTableHead({
  className,
  ...props
}: HeaderCellProps) {
  return (
    <th
      className={cn(
        "px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export function DataTableCell({
  className,
  ...props
}: CellProps) {
  return (
    <td
      className={cn(
        "px-6 py-4 align-middle",
        className
      )}
      {...props}
    />
  );
}

export function DataTableEmpty({
  children,
}: DivProps) {
  return (
    <div className="flex items-center justify-center py-16 text-muted-foreground">
      {children}
    </div>
  );
}