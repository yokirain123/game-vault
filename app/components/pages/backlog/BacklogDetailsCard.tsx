import { IoClose } from "react-icons/io5";
import { FaSteam } from "react-icons/fa";
import { type Game } from "../../../data/gameTypes";
import Link from "next/link";

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
      data-lenis-prevent
      className={`
    sticky top-28 h-[calc(70vh-12rem)] shrink-0 overflow-hidden rounded-3xl bg-background
    transition-all duration-500
    ${selectedGame ? "w-[calc(100vh-12rem)] opacity-100" : "w-0 opacity-0"}
  `}
    >
      {selectedGame && (
        <div className="h-full overflow-y-auto scrollbar-none">
          <div className="relative h-64 w-full overflow-hidden rounded-t-3xl">
            <img
              src={selectedGame.bannerImage}
              alt={selectedGame.title}
              className="h-full w-full object-cover"
            />
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setSelectedGame(null)}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500 bg-bg-alt/75 text-xl text-main hover:bg-accent/75"
              >
                <IoClose size={24} />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between gap-4 text-accent">
              <div className="flex flex-col gap-2">
                <h3 className="text-3xl font-bold">{selectedGame.title}</h3>
              </div>

              {selectedGame.steamUrl && (
                <Link
                  href={selectedGame.steamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-row items-center uppercase text-main gap-3 rounded-3xl bg-bg-alt hover:bg-accent transition-all duration-500 text-xl px-4 py-2"
                >
                  <FaSteam size={20} /> Steam
                </Link>
              )}
            </div>
            <div className="mt-4 flex flex-col gap-5">
              <div className="flex gap-2 flex-col">
                <h4 className="text-lg text-accent font-bold">Жанри</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedGame.genres.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full bg-bg-alt/75 px-3 py-1 text-sm text-main"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
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
                  className="w-full rounded-2xl bg-red-500 px-5 py-3 font-bold text-main transition hover:bg-red-600"
                >
                  Delete review
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}

export default GameDetailsCard;
