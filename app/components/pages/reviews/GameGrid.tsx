import { type Game } from "../../../data/gameTypes";
import GameCard from "./GameCard";

type GameGridProps = {
  games: Game[];
  selectedGame: Game | null;
  onSelectGame: (game: Game) => void;
};

function GameGrid({ games, selectedGame, onSelectGame }: GameGridProps) {
  if (games.length === 0) {
    return (
      <div className="flex min-h-48 flex-1 items-center justify-center rounded-3xl bg-bg-alt/40 p-6 text-center text-main/60">
        Ігор за цими фільтрами не знайдено.
      </div>
    );
  }

  return (
    <div
      className={`
        grid min-w-0 flex-1 grid-cols-2 items-start gap-x-3 gap-y-6
        sm:grid-cols-3 sm:gap-x-5 md:grid-cols-4
        ${
          selectedGame
            ? "lg:grid-cols-2 xl:grid-cols-3"
            : "lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
        }
      `}
    >
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          isSelected={selectedGame?.id === game.id}
          onSelect={onSelectGame}
        />
      ))}
    </div>
  );
}

export default GameGrid;
