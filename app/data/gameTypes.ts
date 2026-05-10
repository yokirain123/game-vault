export type GameReaction =
  | "masterpiece"
  | "recommend"
  | "chill"
  | "average"
  | "terrible";

export type GameRow = {
  id: string;
  slug: string;
  title: string;
  cover_image: string;
  banner_image: string;
  genres: string[];
  platforms: string[];
  status: "backlog" | "playing" | "completed" | "dropped";
  reaction: GameReaction;
  hours_played: number | null;
  is_favorite: boolean;
  personal_review: string | null;
  steam_url: string | null;
  created_at: string;
};

export type Game = {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  bannerImage: string;
  genres: string[];
  platforms: string[];
  status: "backlog" | "playing" | "completed" | "dropped";
  reaction: GameReaction;
  hoursPlayed?: number;
  isFavorite: boolean;
  personalReview?: string;
  steamUrl?: string | null;
};

export function mapGameRowToGame(row: GameRow): Game {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    coverImage: row.cover_image,
    bannerImage: row.banner_image,
    genres: row.genres,
    platforms: row.platforms,
    status: row.status,
    reaction: row.reaction,
    hoursPlayed: row.hours_played ?? undefined,
    isFavorite: row.is_favorite,
    personalReview: row.personal_review ?? undefined,
    steamUrl: row.steam_url ?? undefined,
  };
}