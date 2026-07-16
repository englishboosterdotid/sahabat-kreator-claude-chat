"use client";

import { useEffect, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { AlertTriangle, Zap, AlertCircle } from "lucide-react";

/**
 * Reads the current AI balance from localStorage (synced by the parent page)
 * and renders a contextual banner when balance drops below thresholds.
 *
 * Because we can't call server actions inside a client component, the
 * balance is expected to be available as a prop from the parent page
 * component which called the server action to fetch it.
 */
export function BalanceWarningBanner({
  balanceMicroUsd,
  providerType,
}: {
  balanceMicroUsd: number;
  providerType: string;
}) {
  const [isVisible, setIsVisible] = useState(true);

  if (providerType !== "platform_sumopod" || balanceMicroUsd > 10_000 || !isVisible) {
    return null;
  }

  const level =
    balanceMicroUsd < LOW_BALANCE_CRITICAL_MICRO
      ? "critical" as const
      : balanceMicroUsd < LOW_BALANCE_WARNING_MICRO
        ? "warning" as const
        : "info" as const;

  const config = LEVEL_CONFIG[level];

  return (
    <div
      className={cn(
        "mx-auto flex items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-sm transition-all",
        config.bg,
        config.border,
        config.text
      )}
    >
      <config.icon className="size-5 shrink-0 mt-0.5" />
      <div className="flex-1 space-y-1">
        <p className="font-medium flex items-center gap-2">
          {config.title}
        </p>
        <p className="text-xs opacity-80">
          Saldo: ${(balanceMicroUsd / 1_000_000).toFixed(2)}
        </p>
        {config.cta && (
          <a
            href="/settings/workspace#topup"
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium underline hover:no-underline"
            )}
          >
            Top-Up Sekarang →
          </a>
        )}
      </div>
      <button onClick={() => setIsVisible(false)} className="opacity-60 hover:opacity-100 text-xs">
        ✕
      </button>
    </div>
  );
}

/* Thresholds (micro-USD) */
const LOW_BALANCE_WARNING_MICRO = 1_000_000; // $1
const LOW_BALANCE_CRITICAL_MICRO = 10_000;     // $0.01

/* Level-specific config */
const LEVEL_CONFIG = {
  critical: {
    icon: AlertCircle,
    title: "Saldo hampir habis!",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    cta: true,
  },
  warning: {
    icon: AlertTriangle,
    title: "Saldo sedang menurun",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    cta: true,
  },
  info: {
    icon: Zap,
    title: "Saldo rendah",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    cta: false,
  },
};