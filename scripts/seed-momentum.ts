import "dotenv/config";
import { seedMomentum2026 } from "@/features/momentum-calendar/infrastructure/seed/momentum-2026-seed";

seedMomentum2026().then(() => process.exit(0));