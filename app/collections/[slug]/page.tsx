"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import FeedbackMessage from "@/app/components/ui/FeedbackMessage";
import PageLoading from "@/app/components/ui/PageLoading";

function CollectionPage() {
  const supabase = createClient();
  const params = useParams();
  const router = useRouter();

  const slug = params.slug as string;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        setErrorMessage(collectionError.message);
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
        setErrorMessage(gamesError.message);
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
    return <PageLoading label="Завантажую добірку..." />;
  }

  if (!collection) {
    return (
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main className="page-container flex flex-1 flex-col items-center justify-center pb-16 pt-28 text-center text-main">
          <h1 className="text-3xl font-bold sm:text-5xl">Добірку не знайдено</h1>
          <p className="mt-3 text-main/60">Можливо, посилання застаріло або добірку видалили.</p>
          {errorMessage && (
            <p role="alert" className="mt-4 max-w-lg rounded-2xl bg-red-500/10 p-4 text-sm text-red-500">
              {errorMessage}
            </p>
          )}
          <button
            type="button"
            onClick={() => router.push("/collections")}
            className="mt-6 min-h-11 rounded-xl bg-bg-alt px-5 py-3 font-bold transition-colors hover:bg-accent"
          >
            До всіх добірок
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      <main className="page-container flex-1 pb-16 pt-20 text-main sm:pt-24 lg:pt-28">
        <header className="mb-8 sm:mb-10">
          <button
            type="button"
            className="flex min-h-11 items-center gap-2 rounded-xl py-2 pr-4 text-main/60 transition-colors hover:text-accent"
            onClick={() => router.back()}
          >
            <IoMdArrowRoundBack aria-hidden="true" /> Назад до добірок
          </button>
          <h1 className="mt-2 break-words text-3xl font-bold sm:text-5xl">
            {collection.title}
          </h1>
          <p className="mt-3 max-w-3xl break-words text-main/60">
            {collection.description}
          </p>
        </header>

        <div
          className={`flex min-w-0 items-start ${
            selectedGame ? "lg:gap-8" : "lg:gap-0"
          }`}
        >
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

      <FeedbackMessage
        message={errorMessage}
        onDismiss={() => setErrorMessage(null)}
      />
      <Footer />
    </div>
  );
}

export default CollectionPage;
