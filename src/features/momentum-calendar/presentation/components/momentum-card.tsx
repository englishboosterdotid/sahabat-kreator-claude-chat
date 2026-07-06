import Link from "next/link";
import { MOMENTUM_CATEGORY_LABELS } from "../../domain/value-objects/momentum-category.vo";
import { daysUntil } from "../../domain/entities/momentum-event.entity";
import type { MomentumEvent } from "../../domain/entities/momentum-event.entity";

export function MomentumCard({ event, basePath }: { event: MomentumEvent; basePath: string }) {
  const category = MOMENTUM_CATEGORY_LABELS[event.category];
  const days = daysUntil(event.date);
  const dateFormatted = new Date(event.date).toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <div className="space-y-2 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <span
          className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
          style={{ backgroundColor: category.color }}
        >
          {category.label}
        </span>
        <span className="text-xs text-muted-foreground">
          {days === 0 ? "Hari ini" : days === 1 ? "Besok" : `${days} hari lagi`}
        </span>
      </div>

      <div>
        <p className="text-sm font-medium">
          {event.name}
          {event.isTentative && <span className="ml-1 text-xs text-muted-foreground">(perkiraan)</span>}
        </p>
        <p className="text-xs text-muted-foreground">{dateFormatted}</p>
      </div>

      {event.contentAngleHint && (
        <p className="text-xs text-muted-foreground italic">💡 {event.contentAngleHint}</p>
      )}

      <Link
        href={`${basePath}/content/generate?momentumId=${event.id}`}
        className="inline-block text-xs font-medium text-foreground hover:underline"
      >
        Buat ide konten dari momen ini →
      </Link>
    </div>
  );
}