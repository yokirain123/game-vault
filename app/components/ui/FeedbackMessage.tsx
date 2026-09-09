"use client";

import { IoClose } from "react-icons/io5";

type FeedbackMessageProps = {
  message: string | null;
  onDismiss: () => void;
};

function FeedbackMessage({ message, onDismiss }: FeedbackMessageProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="fixed left-4 right-4 top-20 z-[120] mx-auto flex max-w-lg items-start justify-between gap-4 rounded-2xl border border-red-400/40 bg-zinc-900 px-4 py-3 text-sm text-white shadow-2xl sm:left-auto sm:right-6 sm:top-24 sm:w-full"
    >
      <p className="min-w-0 break-words">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Закрити повідомлення"
        className="-m-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
      >
        <IoClose aria-hidden="true" size={20} />
      </button>
    </div>
  );
}

export default FeedbackMessage;
