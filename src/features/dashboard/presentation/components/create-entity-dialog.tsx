"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState, useTransition, type FormEvent } from "react";

import { Button } from "@/shared/presentation/components/ui/button";
import { FormError } from "@/shared/presentation/components/ui/form-error";
import { Input } from "@/shared/presentation/components/ui/input";
import { createOrganizationAction, createTeamAction } from "@/features/organization/application/use-cases/create-organization-server";

type EntityType = "organization" | "team";

interface CreateEntityDialogProps {
  entityType: EntityType;
  /** Required for "team" — the org that will own the new workspace. */
  organizationId?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (result: { orgId?: string; orgSlug?: string; teamSlug?: string; firstTeamSlug?: string }) => void;
}

const COPY: Record<EntityType, { title: string; label: string; placeholder: string; submit: string }> = {
  organization: {
    title: "Buat Organisasi Baru",
    label: "Nama Organisasi",
    placeholder: "cth: PT Kreator Nusantara",
    submit: "Buat Organisasi",
  },
  team: {
    title: "Buat Workspace Baru",
    label: "Nama Workspace",
    placeholder: "cth: Konten Marketing",
    submit: "Buat Workspace",
  },
};

export function CreateEntityDialog({
  entityType,
  organizationId,
  isOpen,
  onOpenChange,
  onSuccess,
}: CreateEntityDialogProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function reset() {
    setName("");
    setError(null);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama tidak boleh kosong.");
      return;
    }
    setError(null);

    startTransition(async () => {
      if (entityType === "organization") {
        const result = await createOrganizationAction(name);
        if (!result.success) {
          setError(result.error);
          return;
        }
        reset();
        onOpenChange(false);
        onSuccess?.({
          orgId: result.orgId,
          orgSlug: result.orgSlug,
          teamSlug: result.firstTeamSlug,
          firstTeamSlug: result.firstTeamSlug,
        });
        return;
      }

      if (!organizationId) {
        setError("Organisasi tidak ditemukan.");
        return;
      }

      const result = await createTeamAction(organizationId, name);
      if (!result.success) {
        setError(result.error);
        return;
      }
      reset();
      onOpenChange(false);
      onSuccess?.({ teamSlug: result.teamSlug });
    });
  }

  function handleOpenChange(open: boolean) {
    if (!open) reset();
    onOpenChange(open);
  }

  const copy = COPY[entityType];

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background p-6 shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-lg font-semibold text-foreground">
                {copy.title}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                {entityType === "organization"
                  ? "Organisasi adalah ruang untuk semua workspace tim kamu."
                  : "Workspace adalah papan kerja untuk satu tim atau proyek."}
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Tutup"
            >
              <X size={18} />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="entity-name"
                className="text-sm font-medium text-foreground"
              >
                {copy.label}
              </label>
              <Input
                id="entity-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={copy.placeholder}
                autoFocus
                maxLength={100}
                required
              />
            </div>

            {error && <FormError message={error} />}

            <div className="flex gap-2 pt-2">
              <Dialog.Close asChild>
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </Dialog.Close>
              <Button type="submit" isLoading={isPending}>
                {copy.submit}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
