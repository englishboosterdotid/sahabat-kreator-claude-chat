"use client";

import { Button } from "@/shared/presentation/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/presentation/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (value: boolean) => void;

  account: string;

  loading?: boolean;

  onConfirm: () => void;
};

export function DisconnectAccountDialog({
  open,
  onOpenChange,
  account,
  loading,
  onConfirm,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>

          <DialogTitle>
            Disconnect Account
          </DialogTitle>

          <DialogDescription>
            Are you sure you want to disconnect{" "}
            <strong>{account}</strong>?
          </DialogDescription>

        </DialogHeader>

        <DialogFooter>

          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            variant="outline"
            isLoading={loading}
            onClick={onConfirm}
          >
            Disconnect
          </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}