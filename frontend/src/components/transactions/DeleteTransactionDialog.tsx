import type { Transaction } from "@/types";
import ConfirmDialog from "@/components/common/ConfirmDialog";

interface DeleteTransactionDialogProps {
  transaction: Transaction | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Thin wrapper around the generic ConfirmDialog, specialized for deleting a transaction. */
export default function DeleteTransactionDialog({
  transaction,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteTransactionDialogProps) {
  return (
    <ConfirmDialog
      isOpen={!!transaction}
      title="Delete transaction?"
      message={
        transaction
          ? `This will permanently delete "${transaction.title}". This cannot be undone.`
          : ""
      }
      isLoading={isDeleting}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
