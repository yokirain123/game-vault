"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSteam } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { type Game } from "../../../data/gameTypes";

type GameDetailsPanelProps = {
  selectedGame: Game | null;
  isAdmin: boolean;
  setSelectedGame: (game: Game | null) => void;
  handleDeleteReview: (gameId: string) => void;
  handleEditReview: (game: Game) => void;
};

const focusableSelector =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function BacklogDetailsCard({
  selectedGame,
  isAdmin,
  setSelectedGame,
  handleDeleteReview,
  handleEditReview,
}: GameDetailsPanelProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isMobilePanel, setIsMobilePanel] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const updateMode = () => setIsMobilePanel(mediaQuery.matches);
    updateMode();
    mediaQuery.addEventListener("change", updateMode);
    return () => mediaQuery.removeEventListener("change", updateMode);
  }, []);

  useEffect(() => {
    if (!selectedGame) return;

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    if (isMobilePanel) {
      document.body.style.overflow = "hidden";
    }

    const focusFrame = isMobilePanel
      ? window.requestAnimationFrame(() => closeButtonRef.current?.focus())
      : null;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setSelectedGame(null);
        return;
      }

      if (event.key !== "Tab" || !isMobilePanel || !panelRef.current) return;

      const focusableElements = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) return;

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
      if (focusFrame !== null) window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (isMobilePanel) previousActiveElement?.focus();
    };
  }, [isMobilePanel, selectedGame, setSelectedGame]);

  return (
    <aside
      ref={panelRef}
      data-lenis-prevent
      role={isMobilePanel ? "dialog" : "complementary"}
      aria-modal={isMobilePanel ? true : undefined}
      aria-labelledby={selectedGame ? titleId : undefined}
      aria-hidden={!selectedGame}
      className={`fixed inset-0 z-[70] h-[100dvh] w-full overflow-hidden bg-background text-main transition-[transform,opacity,width] duration-300 lg:sticky lg:inset-auto lg:top-28 lg:z-10 lg:h-[calc(100svh-8rem)] lg:max-h-[48rem] lg:shrink-0 lg:rounded-3xl ${
        selectedGame
          ? "visible translate-y-0 opacity-100 lg:w-[min(42vw,38rem)]"
          : "invisible translate-y-full opacity-0 lg:visible lg:w-0 lg:translate-y-0"
      }`}
    >
      {selectedGame && (
        <div className="h-full overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]">
          <div className="relative h-48 w-full overflow-hidden sm:h-64 lg:rounded-t-3xl">
            <Image
              src={selectedGame.bannerImage}
              alt={selectedGame.title}
              fill
              unoptimized
              sizes="(max-width: 1023px) 100vw, 38rem"
              className="h-full w-full object-cover"
            />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setSelectedGame(null)}
              aria-label="Закрити деталі гри"
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-bg-alt/90 text-main backdrop-blur transition-colors hover:bg-accent sm:right-4 sm:top-4"
            >
              <IoClose aria-hidden="true" size={24} />
            </button>
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
              <h2 id={titleId} className="min-w-0 break-words text-2xl font-bold text-accent sm:text-3xl">
                {selectedGame.title}
              </h2>

              {selectedGame.steamUrl && (
                <Link
                  href={selectedGame.steamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 w-full shrink-0 items-center justify-center gap-3 rounded-2xl bg-bg-alt px-4 py-2 uppercase text-main transition-colors hover:bg-accent sm:w-auto"
                >
                  <FaSteam aria-hidden="true" size={20} /> Steam
                </Link>
              )}
            </div>

            <div className="mt-6 grid gap-6">
              {selectedGame.personalReview && (
                <section>
                  <h3 className="text-lg font-bold text-accent">Чому хочу зіграти</h3>
                  <p className="mt-2 whitespace-pre-wrap break-words leading-relaxed">
                    {selectedGame.personalReview}
                  </p>
                </section>
              )}

              <section>
                <h3 className="text-lg font-bold text-accent">Жанри</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedGame.genres.map((genre) => (
                    <span key={genre} className="rounded-full bg-bg-alt/75 px-3 py-1 text-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              </section>

              {selectedGame.platforms.length > 0 && (
                <section>
                  <h3 className="text-lg font-bold text-accent">Платформи</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedGame.platforms.map((platform) => (
                      <span key={platform} className="rounded-full bg-bg-alt/75 px-3 py-1 text-sm">
                        {platform}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {isAdmin && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => handleEditReview(selectedGame)}
                  className="min-h-11 rounded-2xl bg-[#59B292] px-5 py-3 font-bold text-zinc-950 transition-colors hover:bg-[#73d3b2]"
                >
                  Редагувати
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteReview(selectedGame.id)}
                  className="min-h-11 rounded-2xl bg-red-500 px-5 py-3 font-bold text-white transition-colors hover:bg-red-600"
                >
                  Видалити
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}

export default BacklogDetailsCard;
