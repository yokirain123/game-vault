import { type Game } from "./gameTypes";

export const gameStatusLabels: Record<Game["status"], string> = {
  backlog: "У планах",
  playing: "Граю",
  completed: "Пройдено",
  dropped: "Закинуто",
};