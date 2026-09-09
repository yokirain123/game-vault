import Image from "next/image";
import { type Game } from "../../../data/gameTypes";
import {
  gameReactionEmoji,
  gameReactionLabels,
} from "../../../data/gameReactions";

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
      aria-pressed={isSelected}
      className={`
        group min-w-0 overflow-hidden rounded-3xl text-left
        transition-shadow duration-300
        ${isSelected ? "ring-2 ring-accent ring-offset-4 ring-offset-background" : ""}
      `}
    >
      <div className="flex min-w-0 flex-col">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl sm:rounded-3xl lg:aspect-[4/3]">
          <span
            title={gameReactionLabels[game.reaction]}
            className="absolute top-2 right-2 z-10 shrink-0 text-2xl cursor-help"
          >
            {gameReactionEmoji[game.reaction]}
          </span>
          <Image
            src={game.coverImage}
            alt={game.title}
            fill
            unoptimized
            sizes="(max-width: 639px) 45vw, (max-width: 1023px) 30vw, 18vw"
            className="h-full w-full object-cover transition-[transform,filter] duration-500 group-hover:scale-105 group-hover:brightness-110 group-hover:contrast-110"
          />
        </div>

        <div className="px-1 pt-2 text-center sm:px-3">
          <h3 className="break-words text-base font-light leading-tight text-main sm:text-lg">
            {game.title}
          </h3>
        </div>
      </div>
    </button>
  );
}

export default GameCard;
