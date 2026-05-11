import { type Game, type GameRow, mapGameRowToGame } from "./gameTypes";

export type CollectionRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image: string | null;
  created_at: string;
};

export type Collection = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  coverImage?: string;
  createdAt: string;
};

export type CollectionGameRow = {
  id: string;
  collection_id: string;
  game_id: string;
  game: GameRow | null;
};

export type CollectionWithGames = Collection & {
  games: Game[];
};

export function mapCollectionRowToCollection(row: CollectionRow): Collection {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? undefined,
    coverImage: row.cover_image ?? undefined,
    createdAt: row.created_at,
  };
}

export function mapCollectionGameRowsToGames(rows: CollectionGameRow[]): Game[] {
  return rows
    .filter((row) => row.game)
    .map((row) => mapGameRowToGame(row.game as GameRow));
}