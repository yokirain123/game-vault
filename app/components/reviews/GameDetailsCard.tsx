import { type Game } from "../../data/gameTypes";
import { IoClose } from "react-icons/io5";
import { FaSteam } from "react-icons/fa";
import {
  gameReactionEmoji,
  gameReactionLabels,
} from "../../data/gameReactions";
import Link from "next/link";
import { gameStatusLabels } from "../../data/gameStatuses";

type GameDetailsPanelProps = {
  selectedGame: Game | null;
  isAdmin: boolean;
  setSelectedGame: (game: Game | null) => void;
  handleDeleteReview: (gameId: string) => void;
  handleEditReview: (game: Game) => void;
};

function GameDetailsCard({
  selectedGame,
  isAdmin,
  setSelectedGame,
  handleDeleteReview,
  handleEditReview,
}: GameDetailsPanelProps) {
  return (
    <aside
      className={`
    sticky top-28 h-[calc(100vh-12rem)] shrink-0 overflow-hidden rounded-3xl bg-zinc-800
    transition-all duration-500
    ${selectedGame ? "w-[calc(100vh-12rem)] opacity-100" : "w-0 opacity-0"}
  `}
    >
      {selectedGame && (
        <div className="h-full overflow-y-auto scrollbar-none">
          <div className="relative h-64 w-full overflow-hidden rounded-t-3xl bg-zinc-700">
            <img
              src={selectedGame.bannerImage}
              alt={selectedGame.title}
              className="h-full w-full object-cover"
            />
            <div className="flex justify-between items-center">
              <div className="absolute top-4 left-4 shrink-0 rounded-2xl bg-zinc-900/75 p-2 text-md">
                {gameReactionEmoji[selectedGame.reaction]}{" "}
                {gameReactionLabels[selectedGame.reaction]}
              </div>
              <button
                type="button"
                onClick={() => setSelectedGame(null)}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500 bg-zinc-900/75 text-xl text-white hover:bg-[#59B292]/75"
              >
                <IoClose size={24} />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-3xl font-bold">{selectedGame.title}</h3>

                <p className="text-sm uppercase tracking-wide text-[#59B292]">
  {gameStatusLabels[selectedGame.status]}
</p>
              </div>

              {selectedGame.steamUrl && (
                <Link
                  href={selectedGame.steamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-row items-center uppercase gap-3 rounded-3xl bg-background hover:bg-[#59B292] transition-all duration-500 text-xl px-4 py-2"
                >
                  <FaSteam size={20} /> Steam
                </Link>
              )}
            </div>
            <div className="mt-4 flex flex-col gap-5">
              <div className="flex gap-2 flex-col">
                <h4 className="text-lg text-[#59B292] font-bold">
                  Особиста рецензія
                </h4>
                <p className="whitespace-pre-wrap leading-relaxed text-zinc-300">
                  {selectedGame.personalReview || "Немає особистої рецензії"}
                </p>
              </div>
              <div className="flex gap-2 flex-col">
                <h4 className="text-lg font-bold">Жанри</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedGame.genres.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full bg-zinc-700 px-3 py-1 text-sm text-zinc-300"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 flex-col">
                <h4 className="text-lg font-bold">Платформи</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedGame.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="rounded-full bg-zinc-700 px-3 py-1 text-sm text-zinc-300"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-zinc-900 p-4">
                  <p className="text-sm text-zinc-400">Годин зіграно</p>
                  <p className="text-2xl font-bold">
                    {selectedGame.hoursPlayed ?? 0}h
                  </p>
                </div>

                <div className="rounded-2xl bg-zinc-900 p-4">
                  <p className="text-sm text-zinc-400">Улюблена</p>
                  <p className="text-2xl font-bold">
                    {selectedGame.isFavorite ? "Так" : "Ні"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              {isAdmin && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleEditReview(selectedGame)}
                    className="w-full rounded-2xl bg-[#59B292] px-5 py-3 font-bold text-zinc-900 transition hover:bg-[#73d3b2]"
                  >
                    Edit review
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteReview(selectedGame.id)}
                    className="w-full rounded-2xl bg-red-500 px-5 py-3 font-bold text-white transition hover:bg-red-600"
                  >
                    Delete review
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default GameDetailsCard;
