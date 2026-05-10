import { type Game } from "../../data/gameTypes";
import {
  gameReactionEmoji,
  gameReactionLabels,
} from "../../data/gameReactions";

type GameCardProps = {
  game: Game;
  isSelected: boolean;
  onSelect: (game: Game) => void;
};

function GameCard({ game, isSelected, onSelect }: GameCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(game)}
      className={`
        group overflow-hidden h-auto rounded-3xL text-left
        transition-all duration-300
        ${isSelected ? "" : ""}
      `}
    >
        <div className="flex flex-col ">
            <div className="relative h-44 w-full overflow-hidden rounded-3xl">
        <span
          title={gameReactionLabels[game.reaction]}
          className="absolute top-2 right-2 z-10 shrink-0 text-2xl cursor-help"
        >
          {gameReactionEmoji[game.reaction]}
        </span>
        <img
          src={game.coverImage}
          alt={game.title}
          className="h-full w-full rounded-3xl object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-120 group-hover:contrast-110"
        />
      </div>

      <div className="px-5 text-center">
          <h3 className="text-lg font-light leading-tight">{game.title}</h3>
      </div>
        </div>
      
    </button>
  );
}

export default GameCard;
