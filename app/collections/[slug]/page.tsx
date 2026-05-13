"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "../../components/ui/Header";
import { createClient } from "../../data/supabaseClient";
import {
  type Collection,
  type CollectionRow,
  type CollectionGameRow,
  mapCollectionRowToCollection,
  mapCollectionGameRowsToGames,
} from "../../data/collectionTypes";
import { type Game } from "../../data/gameTypes";
import BacklogGrid from "@/app/components/pages/backlog/BacklogGrid";
import BacklogDetailsCard from "@/app/components/pages/backlog/BacklogDetailsCard";
import { IoMdArrowRoundBack } from "react-icons/io";
import Footer from "@/app/components/ui/Footer";

function CollectionPage() {
  const supabase = createClient();
  const params = useParams();

  const slug = params.slug as string;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    async function fetchCollection() {
      setIsLoading(true);

      const { data: collectionData, error: collectionError } = await supabase
        .from("collections")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (collectionError) {
        console.error("Error fetching collection:", collectionError.message);
        setIsLoading(false);
        return;
      }

      if (!collectionData) {
        setCollection(null);
        setIsLoading(false);
        return;
      }

      const mappedCollection = mapCollectionRowToCollection(
        collectionData as CollectionRow,
      );

      setCollection(mappedCollection);

      const { data: gamesData, error: gamesError } = await supabase
        .from("collection_games")
        .select(
          `
          id,
          collection_id,
          game_id,
          game:games (*)
        `,
        )
        .eq("collection_id", mappedCollection.id);

      if (gamesError) {
        console.error("Error fetching collection games:", gamesError.message);
        setIsLoading(false);
        return;
      }

      setGames(
        mapCollectionGameRowsToGames(
          gamesData as unknown as CollectionGameRow[],
        ),
      );

      setIsLoading(false);
    }

    fetchCollection();
  }, [slug, supabase]);

  if (isLoading) {
    return <Header />;
  }

  if (!collection) {
    return (
      <section className="w-full px-16 py-20 text-main">
        <p className="text-main/50">Collection not found.</p>
      </section>
    );
  }

  return (
    <div>
      <Header />

      <main className="px-16 py-10 text-main mt-17">
        <div className="mb-10">
          <div
            className="flex items-center gap-2 text-main/50 hover:text-accent cursor-pointer transition-all duration-500 py-4"
            onClick={() => window.history.back()}
          >
            <IoMdArrowRoundBack /> Назад до колекцій
          </div>
          <h1 className="text-5xl font-bold">{collection.title}</h1>
          <p className="mt-3 max-w-3xl text-main/50">
            {collection.description}
          </p>
        </div>

        <div className="flex items-start gap-8">
          <BacklogGrid
            games={games}
            selectedGame={selectedGame}
            onSelectGame={setSelectedGame}
          />

          <BacklogDetailsCard
            selectedGame={selectedGame}
            isAdmin={false}
            setSelectedGame={setSelectedGame}
            handleDeleteReview={() => {}}
            handleEditReview={() => {}}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CollectionPage;
