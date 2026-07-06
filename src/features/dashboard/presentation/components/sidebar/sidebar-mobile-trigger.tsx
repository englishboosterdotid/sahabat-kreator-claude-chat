"use client";

import { Menu, X } from "lucide-react";

export function SidebarMobileTrigger({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="inline-flex size-9 items-center justify-center rounded-md border md:hidden"
      aria-label="Toggle sidebar"
    >
      {isOpen ? <X size={18} /> : <Menu size={18} />}
    </button>
  );
}