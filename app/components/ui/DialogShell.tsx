"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { IoClose } from "react-icons/io5";

type DialogShellProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  maxWidthClass?: string;
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function DialogShell({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidthClass = "max-w-2xl",
}: DialogShellProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      const firstFocusable =
        panelRef.current?.querySelector<HTMLElement>(focusableSelector);
      (firstFocusable ?? panelRef.current)?.focus();
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusableElements = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => !element.hasAttribute("aria-hidden"));

      if (focusableElements.length === 0) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElement?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-black/70 pt-16 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        data-lenis-prevent
        className={`relative max-h-[calc(100dvh-4rem)] w-full overflow-y-auto rounded-t-3xl bg-zinc-900 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-zinc-100 shadow-2xl sm:max-h-[90dvh] sm:rounded-3xl sm:p-8 ${maxWidthClass}`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрити діалог"
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-800 text-zinc-100 transition hover:bg-zinc-700 sm:right-5 sm:top-5"
        >
          <IoClose aria-hidden="true" size={24} />
        </button>

        <h2 id={titleId} className="mb-2 pr-14 text-2xl font-bold text-accent sm:text-3xl">
          {title}
        </h2>

        {description && (
          <p id={descriptionId} className="mb-6 max-w-prose text-sm text-zinc-300">
            {description}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}

export default DialogShell;
