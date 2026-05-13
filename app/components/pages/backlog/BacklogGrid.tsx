import { type Game } from "../../../data/gameTypes";
import BacklogCard from "./BacklogCard";

type BacklogGridProps = {
  games: Game[];
  selectedGame: Game | null;
  onSelectGame: (game: Game) => void;
};

function BacklogGrid({ games, selectedGame, onSelectGame }: BacklogGridProps) {
  return (
    <div
      className={`
        grid flex-1 items-start grid-cols-1 gap-6 transition-all duration-500
        sm:grid-cols-2
        ${
          selectedGame
            ? "lg:grid-cols-2 xl:grid-cols-3"
            : "lg:grid-cols-5 xl:grid-cols-6"
        }
      `}
    >
      {games.map((game) => (
        <BacklogCard
          key={game.id}
          game={game}
          isSelected={selectedGame?.id === game.id}
          onSelect={onSelectGame}
        />
      ))}
    </div>
  );
}

export default BacklogGrid;
