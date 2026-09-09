"use client";

import { useState } from "react";
import {
  IoChevronDown,
  IoChevronUp,
  IoClose,
  IoSearch,
} from "react-icons/io5";
import {
  gameReactionEmoji,
  gameReactionLabels,
} from "../../../data/gameReactions";
import { type GameReaction } from "../../../data/gameTypes";

type ReviewsFiltersProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedGenres: string[];
  setSelectedGenres: React.Dispatch<React.SetStateAction<string[]>>;
  selectedReaction: GameReaction | "all";
  setSelectedReaction: (value: GameReaction | "all") => void;
  availableGenres: string[];
  resetFilters: () => void;
};

const reactions: GameReaction[] = [
  "masterpiece",
  "recommend",
  "chill",
  "average",
  "terrible",
];

function ReviewsFilters({
  searchQuery,
  setSearchQuery,
  selectedGenres,
  setSelectedGenres,
  selectedReaction,
  setSelectedReaction,
  availableGenres,
  resetFilters,
}: ReviewsFiltersProps) {
  const [isGenresOpen, setIsGenresOpen] = useState(false);
  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedGenres.length > 0 ||
    selectedReaction !== "all";

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(16rem,1fr)_auto_auto]">
        <label className="flex min-h-12 items-center gap-3 rounded-2xl bg-bg-alt/50 px-4 sm:rounded-full sm:px-6">
          <span className="sr-only">Пошук за назвою гри</span>
          <IoSearch aria-hidden="true" className="shrink-0 text-main/60" size={20} />
          <input
            type="search"
            placeholder="Назва гри..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-base text-main outline-none placeholder:text-main/45"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Очистити пошук"
              className="-mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-main/60 transition hover:bg-bg-alt hover:text-accent"
            >
              <IoClose aria-hidden="true" size={20} />
            </button>
          )}
        </label>

        <div
          role="group"
          aria-label="Фільтр за реакцією"
          className="grid min-h-12 grid-cols-5 items-center gap-1 rounded-2xl bg-bg-alt/50 p-1 sm:rounded-full sm:px-2"
        >
          {reactions.map((reaction) => (
            <button
              key={reaction}
              type="button"
              onClick={() =>
                setSelectedReaction(
                  selectedReaction === reaction ? "all" : reaction,
                )
              }
              aria-label={gameReactionLabels[reaction]}
              aria-pressed={selectedReaction === reaction}
              title={gameReactionLabels[reaction]}
              className={`flex h-11 min-w-0 items-center justify-center rounded-full text-lg transition-colors sm:w-11 ${
                selectedReaction === reaction
                  ? "bg-bg-alt text-accent"
                  : "hover:bg-bg-alt/75"
              }`}
            >
              <span aria-hidden="true">{gameReactionEmoji[reaction]}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsGenresOpen((current) => !current)}
          aria-expanded={isGenresOpen}
          aria-controls="genre-filters"
          className="flex min-h-12 items-center justify-center gap-3 rounded-2xl bg-bg-alt/50 px-6 py-3 font-bold text-main transition-colors hover:bg-bg-alt/75 sm:rounded-full"
        >
          Жанри
          {selectedGenres.length > 0 && (
            <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-background">
              {selectedGenres.length}
            </span>
          )}
          {isGenresOpen ? (
            <IoChevronUp aria-hidden="true" size={18} />
          ) : (
            <IoChevronDown aria-hidden="true" size={18} />
          )}
        </button>
      </div>

      {isGenresOpen && (
        <div id="genre-filters" className="rounded-3xl bg-bg-alt/50 p-4 sm:px-7 sm:py-6">
          {availableGenres.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
              {availableGenres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() =>
                    setSelectedGenres((currentGenres) =>
                      currentGenres.includes(genre)
                        ? currentGenres.filter((item) => item !== genre)
                        : [...currentGenres, genre],
                    )
                  }
                  aria-pressed={selectedGenres.includes(genre)}
                  className={`min-h-11 rounded-xl px-3 py-2 text-left transition-colors sm:px-4 ${
                    selectedGenres.includes(genre)
                      ? "bg-bg-alt text-accent"
                      : "text-main hover:bg-bg-alt/75 hover:text-accent"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          ) : (
            <p className="py-2 text-sm text-main/60">Жанри з’являться після додавання ігор.</p>
          )}
        </div>
      )}

      {hasActiveFilters && (
        <button
          type="button"
          onClick={resetFilters}
          className="min-h-11 self-stretch rounded-xl px-4 py-2 text-sm font-bold text-main/70 transition-colors hover:bg-bg-alt/50 hover:text-accent sm:self-end"
        >
          Скинути всі фільтри
        </button>
      )}
    </div>
  );
}

export default ReviewsFilters;
