import { type GameReaction } from "./gameTypes";

export const gameReactionEmoji: Record<GameReaction, string> = {
  masterpiece: "🔥",
  recommend: "👍",
  chill: "🍺",
  average: "😐",
  terrible: "👎",
};

export const gameReactionLabels: Record<GameReaction, string> = {
  masterpiece: "Оцінка: Шедевр",
  recommend: "Оцінка: Рекомендую",
  chill: "Оцінка: Під пиво піде",
  average: "Оцінка: Так собі",
  terrible: "Оцінка: Жахливо",
};