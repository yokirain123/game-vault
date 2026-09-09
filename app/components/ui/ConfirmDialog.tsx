"use client";

import DialogShell from "./DialogShell";

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Видалити",
  isPending = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <DialogShell
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={message}
      maxWidthClass="max-w-md"
    >
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="min-h-11 rounded-xl bg-zinc-800 px-5 py-3 font-bold text-zinc-100 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Скасувати
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isPending}
          className="min-h-11 rounded-xl bg-red-500 px-5 py-3 font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Видаляю..." : confirmLabel}
        </button>
      </div>
    </DialogShell>
  );
}

export default ConfirmDialog;
