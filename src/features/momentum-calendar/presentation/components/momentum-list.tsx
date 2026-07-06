import { MomentumCard } from "./momentum-card";
import type { MomentumEvent } from "../../domain/entities/momentum-event.entity";

export function MomentumList({ events, basePath }: { events: MomentumEvent[]; basePath: string }) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Tidak ada momentum dalam 30 hari ke depan.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <MomentumCard key={event.id} event={event} basePath={basePath} />
      ))}
    </div>
  );
}