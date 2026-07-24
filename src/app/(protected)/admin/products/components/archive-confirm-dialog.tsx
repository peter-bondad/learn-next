"use client";

import { toast } from "sonner";
import { useArchiveProduct } from "@/lib/api/product/product.mutation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ArchiveConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
};

export function ArchiveConfirmDialog({
  open,
  onOpenChange,
  productId,
  productName,
}: ArchiveConfirmDialogProps) {
  const archiveMutation = useArchiveProduct();

  const handleConfirm = async () => {
    try {
      await archiveMutation.mutateAsync(productId);
      toast.success("Product archived.");
      onOpenChange(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to archive product.";
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Archive product?</DialogTitle>
          <DialogDescription>
            This will mark <strong>{productName}</strong> as unavailable. You can
            restore it later if needed.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={archiveMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={archiveMutation.isPending}
          >
            {archiveMutation.isPending ? "Archiving..." : "Archive"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
