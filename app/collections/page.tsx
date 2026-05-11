"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/ui/Header";
import { createClient } from "../lib/supabaseClient";
import {
  type Collection,
  type CollectionRow,
  mapCollectionRowToCollection,
} from "../data/collectionTypes";
import { type Game, type GameRow, mapGameRowToGame } from "../data/gameTypes";
import AddCollectionButton from "../components/pages/collections/addCollectionButton";
import AddCollectionModal from "../components/pages/collections/addCollectionModal";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function CollectionsPage() {
  const supabase = createClient();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [games, setGames] = useState<Game[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(
    null,
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverImage: "",
    gameIds: [] as string[],
  });

  function resetForm() {
    setFormData({
      title: "",
      description: "",
      coverImage: "",
      gameIds: [],
    });
  }

  function handleCloseCollectionModal() {
    setIsCollectionModalOpen(false);
    setEditingCollectionId(null);
    resetForm();
  }

  useEffect(() => {
    async function fetchCollections() {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching collections:", error.message);
        setIsLoading(false);
        return;
      }

      setCollections(
        (data as CollectionRow[]).map(mapCollectionRowToCollection),
      );

      setIsLoading(false);
    }

    async function fetchGames() {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching games:", error.message);
        return;
      }

      setGames((data as GameRow[]).map(mapGameRowToGame));
    }

    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setIsAdmin(user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL);
    }

    fetchCollections();
    fetchGames();
    checkAdmin();
  }, [supabase]);

  async function handleEditCollection(collection: Collection) {
    setEditingCollectionId(collection.id);

    const { data, error } = await supabase
      .from("collection_games")
      .select("game_id")
      .eq("collection_id", collection.id);

    if (error) {
      console.error("Error fetching collection games:", error.message);
      alert(error.message);
      return;
    }

    setFormData({
      title: collection.title,
      description: collection.description || "",
      coverImage: collection.coverImage || "",
      gameIds: data.map((item) => item.game_id),
    });

    setIsCollectionModalOpen(true);
  }

  async function handleDeleteCollection(collectionId: string) {
    const confirmed = confirm("Are you sure you want to delete this collection?");

    if (!confirmed) return;

    const { error } = await supabase
      .from("collections")
      .delete()
      .eq("id", collectionId);

    if (error) {
      console.error("Error deleting collection:", error.message);
      alert(error.message);
      return;
    }

    setCollections((prevCollections) =>
      prevCollections.filter((collection) => collection.id !== collectionId),
    );
  }

  async function handleSaveCollection(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setIsSaving(true);

    const collectionPayload = {
      slug: createSlug(formData.title),
      title: formData.title,
      description: formData.description || null,
      cover_image: formData.coverImage || null,
    };

    if (editingCollectionId) {
      const { data: updatedCollectionData, error: updateError } = await supabase
        .from("collections")
        .update(collectionPayload)
        .eq("id", editingCollectionId)
        .select()
        .single();

      if (updateError) {
        setIsSaving(false);
        console.error("Error updating collection:", updateError.message);
        alert(updateError.message);
        return;
      }

      const { error: deleteOldGamesError } = await supabase
        .from("collection_games")
        .delete()
        .eq("collection_id", editingCollectionId);

      if (deleteOldGamesError) {
        setIsSaving(false);
        console.error(
          "Error deleting old collection games:",
          deleteOldGamesError.message,
        );
        alert(deleteOldGamesError.message);
        return;
      }

      if (formData.gameIds.length > 0) {
        const collectionGamesPayload = formData.gameIds.map((gameId) => ({
          collection_id: editingCollectionId,
          game_id: gameId,
        }));

        const { error: insertGamesError } = await supabase
          .from("collection_games")
          .insert(collectionGamesPayload);

        if (insertGamesError) {
          setIsSaving(false);
          console.error(
            "Error updating collection games:",
            insertGamesError.message,
          );
          alert(insertGamesError.message);
          return;
        }
      }

      const updatedCollection = mapCollectionRowToCollection(
        updatedCollectionData as CollectionRow,
      );

      setCollections((prevCollections) =>
        prevCollections.map((collection) =>
          collection.id === editingCollectionId ? updatedCollection : collection,
        ),
      );

      setEditingCollectionId(null);
      setIsCollectionModalOpen(false);
      setIsSaving(false);
      resetForm();

      return;
    }

    const { data: collectionData, error: collectionError } = await supabase
      .from("collections")
      .insert(collectionPayload)
      .select()
      .single();

    if (collectionError) {
      setIsSaving(false);
      console.error("Error creating collection:", collectionError.message);
      alert(collectionError.message);
      return;
    }

    const createdCollection = mapCollectionRowToCollection(
      collectionData as CollectionRow,
    );

    if (formData.gameIds.length > 0) {
      const collectionGamesPayload = formData.gameIds.map((gameId) => ({
        collection_id: createdCollection.id,
        game_id: gameId,
      }));

      const { error: collectionGamesError } = await supabase
        .from("collection_games")
        .insert(collectionGamesPayload);

      if (collectionGamesError) {
        setIsSaving(false);
        console.error(
          "Error adding games to collection:",
          collectionGamesError.message,
        );
        alert(collectionGamesError.message);
        return;
      }
    }

    setCollections((prevCollections) => [createdCollection, ...prevCollections]);

    setIsSaving(false);
    setIsCollectionModalOpen(false);
    resetForm();
  }

  if (isLoading) {
    return <Header />;
  }

  return (
    <div>
      <Header />

      <main className="mt-7 px-16 py-20 text-white">
        <div className="mb-10">
          <h1 className="text-5xl font-bold">Добірки</h1>
          <p className="mt-3 text-zinc-400">
            Ігри не просто списком, а під конкретний настрій.
          </p>
        </div>

        {collections.length === 0 ? (
          <div className="rounded-3xl bg-zinc-900 p-10 text-center text-zinc-400">
            Добірок поки немає.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="group overflow-hidden rounded-3xl bg-zinc-900 transition-all duration-300"
              >
                <Link href={`/collections/${collection.slug}`}>
                  <div className="h-56 overflow-hidden bg-zinc-800 hover:brightness-120 hover:contrast-110 transition-all duration-500">
                    {collection.coverImage ? (
                      <img
                        src={collection.coverImage}
                        alt={collection.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-500">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h2 className="text-2xl font-bold">{collection.title}</h2>

                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-400">
                      {collection.description || "No description yet."}
                    </p>
                  </div>
                </Link>

                {isAdmin && (
                  <div className="grid grid-cols-2 gap-3 px-6 pb-6">
                    <button
                      type="button"
                      onClick={() => handleEditCollection(collection)}
                      className="rounded-2xl bg-[#59B292] px-4 py-3 font-bold text-zinc-950 transition hover:bg-[#73d3b2]"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCollection(collection.id)}
                      className="rounded-2xl bg-red-500 px-4 py-3 font-bold text-white transition hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <AddCollectionButton
          isAdmin={isAdmin}
          setIsCollectionModalOpen={setIsCollectionModalOpen}
        />

        <AddCollectionModal
          isCollectionModalOpen={isCollectionModalOpen}
          setIsCollectionModalOpen={setIsCollectionModalOpen}
          handleCloseCollectionModal={handleCloseCollectionModal}
          formData={formData}
          setFormData={setFormData}
          games={games}
          handleSaveCollection={handleSaveCollection}
          isSaving={isSaving}
          isEditing={Boolean(editingCollectionId)}
        />
      </main>
    </div>
  );
}

export default CollectionsPage;