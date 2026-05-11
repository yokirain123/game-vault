"use client";

import { useState } from "react";
import { IoSearch, IoChevronDown, IoChevronUp } from "react-icons/io5";
import { type GameReaction } from "../../../data/gameTypes";
import {
  gameReactionEmoji,
  gameReactionLabels,
} from "../../../data/gameReactions";

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

function ReviewsFilters({
  searchQuery,
  setSearchQuery,
  selectedGenres,
  setSelectedGenres,
  selectedReaction,
  setSelectedReaction,
  availableGenres,
}: ReviewsFiltersProps) {
  const [isGenresOpen, setIsGenresOpen] = useState(false);

  const reactions: Array<GameReaction> = [
    "masterpiece",
    "recommend",
    "chill",
    "average",
    "terrible",
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-[1fr_auto_auto] gap-3">
        <div className="flex items-center gap-4 rounded-full bg-zinc-900 px-6 py-4">
          <IoSearch className="shrink-0 text-zinc-300" size={20} />

          <input
            type="text"
            placeholder="Назва гри..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full bg-transparent text-white outline-none placeholder:text-zinc-500"
          />
        </div>

        <div className="flex items-center gap-3 rounded-full bg-zinc-900 px-8 py-2">
          {reactions.map((reaction) => (
            <button
              key={reaction}
              type="button"
              onClick={() =>
                setSelectedReaction(
                  selectedReaction === reaction ? "all" : reaction,
                )
              }
              title={gameReactionLabels[reaction]}
              className={`
      rounded-full px-3 py-1 text-lg transition
      ${selectedReaction === reaction ? "bg-zinc-800" : "hover:bg-zinc-800"}
    `}
            >
              {gameReactionEmoji[reaction]}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsGenresOpen((prev) => !prev)}
          className={`
            flex items-center justify-center gap-3 rounded-full px-8 py-4 font-bold transition
            ${isGenresOpen ? "bg-zinc-950" : "bg-zinc-800 hover:bg-zinc-700"}
          `}
        >
          Жанри
          {isGenresOpen ? (
            <IoChevronUp size={18} />
          ) : (
            <IoChevronDown size={18} />
          )}
        </button>
      </div>

      {isGenresOpen && (
        <div className="rounded-3xl bg-zinc-950 px-7 py-6">
          <div className="grid grid-cols-4 gap-x-20 gap-y-4">
            {availableGenres.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() =>
                  setSelectedGenres((prevGenres) =>
                    prevGenres.includes(genre)
                      ? prevGenres.filter((item) => item !== genre)
                      : [...prevGenres, genre],
                  )
                }
                className={`
      w-fit rounded-xl px-4 py-2 text-left transition
      ${
        selectedGenres.includes(genre)
          ? "bg-zinc-800 text-white"
          : "text-zinc-200 hover:bg-zinc-900 hover:text-white"
      }
    `}
              >
                {genre}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setSelectedGenres([])}
            className="mt-8 w-full rounded-full bg-zinc-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-[#59B292] hover:text-zinc-950"
          >
            Скинути фільтри жанрів
          </button>
        </div>
      )}
    </div>
  );
}

export default ReviewsFilters;
