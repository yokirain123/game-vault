"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/ui/Header";
import { createClient } from "../data/supabaseClient";
import {
  type Collection,
  type CollectionRow,
  mapCollectionRowToCollection,
} from "../data/collectionTypes";
import { type Game, type GameRow, mapGameRowToGame } from "../data/gameTypes";
import AddCollectionButton from "../components/pages/collections/addCollectionButton";
import AddCollectionModal from "../components/pages/collections/addCollectionModal";
import Footer from "../components/ui/Footer";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import FeedbackMessage from "../components/ui/FeedbackMessage";
import PageLoading from "../components/ui/PageLoading";
import { focusFormControl, isValidHttpUrl } from "../data/formValidation";

function createSlug(title: string) {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return `${baseSlug || "collection"}-${Date.now().toString(36)}`;
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
  const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        setErrorMessage(error.message);
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
        setErrorMessage(error.message);
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
      setErrorMessage(error.message);
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

  function handleDeleteCollection(collectionId: string) {
    setDeleteTarget(
      collections.find((collection) => collection.id === collectionId) ?? null,
    );
  }

  async function confirmDeleteCollection() {
    if (!deleteTarget) return;

    setErrorMessage(null);
    setIsDeleting(true);

    const { error } = await supabase
      .from("collections")
      .delete()
      .eq("id", deleteTarget.id);

    setIsDeleting(false);

    if (error) {
      console.error("Error deleting collection:", error.message);
      setErrorMessage(error.message);
      return;
    }

    setCollections((prevCollections) =>
      prevCollections.filter((collection) => collection.id !== deleteTarget.id),
    );
    setDeleteTarget(null);
  }

  async function handleSaveCollection(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage(null);

    if (!formData.title.trim()) {
      setErrorMessage("Заповни поле «Назва добірки».");
      focusFormControl(event.currentTarget, "title");
      return;
    }

    if (!isValidHttpUrl(formData.coverImage)) {
      setErrorMessage("Поле «URL обкладинки» має містити коректне http(s)-посилання.");
      focusFormControl(event.currentTarget, "coverImage");
      return;
    }

    setIsSaving(true);

    const collectionPayload = {
      title: formData.title,
      description: formData.description || null,
      cover_image: formData.coverImage || null,
    };

    const newCollectionPayload = {
      ...collectionPayload,
      slug: createSlug(formData.title),
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
        setErrorMessage(updateError.message);
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
        setErrorMessage(deleteOldGamesError.message);
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
          setErrorMessage(insertGamesError.message);
          return;
        }
      }

      const updatedCollection = mapCollectionRowToCollection(
        updatedCollectionData as CollectionRow,
      );

      setCollections((prevCollections) =>
        prevCollections.map((collection) =>
          collection.id === editingCollectionId
            ? updatedCollection
            : collection,
        ),
      );

      setEditingCollectionId(null);
      setIsSaving(false);
      handleCloseCollectionModal();

      return;
    }

    const { data: collectionData, error: collectionError } = await supabase
      .from("collections")
      .insert(newCollectionPayload)
      .select()
      .single();

    if (collectionError) {
      setIsSaving(false);
      console.error("Error creating collection:", collectionError.message);
      setErrorMessage(collectionError.message);
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
        setErrorMessage(collectionGamesError.message);
        return;
      }
    }

    setCollections((prevCollections) => [
      createdCollection,
      ...prevCollections,
    ]);

    setIsSaving(false);
    handleCloseCollectionModal();
  }

  if (isLoading) {
    return <PageLoading label="Завантажую добірки..." />;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      <main className="page-container flex-1 pb-16 pt-24 text-main sm:pt-28 lg:pt-32">
        <header className="mb-8 sm:mb-10">
          <h1 className="text-3xl font-bold sm:text-5xl">Добірки</h1>
          <p className="mt-3 max-w-2xl text-main/60">
            Ігри не просто списком, а під конкретний настрій.
          </p>
        </header>

        {collections.length === 0 ? (
          <div className="rounded-3xl bg-bg-alt/50 p-8 text-center text-main/60 sm:p-10">
            Добірок поки немає.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="group min-w-0 overflow-hidden rounded-3xl bg-bg-alt/50 transition-colors duration-300"
              >
                <Link
                  href={`/collections/${collection.slug}`}
                  className="block rounded-t-3xl"
                >
                  <div className="relative aspect-[16/10] overflow-hidden transition-[filter] duration-500 hover:brightness-110 hover:contrast-110">
                    {collection.coverImage ? (
                      <Image
                        src={collection.coverImage}
                        alt={collection.title}
                        fill
                        unoptimized
                        sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1279px) 45vw, 31vw"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-main">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="p-5 sm:p-6">
                    <h2 className="break-words text-xl font-bold sm:text-2xl">
                      {collection.title}
                    </h2>

                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-main">
                      {collection.description || "No description yet."}
                    </p>
                  </div>
                </Link>

                {isAdmin && (
                  <div className="grid grid-cols-2 gap-3 px-5 pb-5 sm:px-6 sm:pb-6">
                    <button
                      type="button"
                      onClick={() => handleEditCollection(collection)}
                      className="min-h-11 rounded-2xl bg-[#59B292] px-4 py-3 font-bold text-zinc-950 transition-colors hover:bg-[#73d3b2]"
                    >
                      Редагувати
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCollection(collection.id)}
                      className="min-h-11 rounded-2xl bg-red-500 px-4 py-3 font-bold text-white transition-colors hover:bg-red-600"
                    >
                      Видалити
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
          handleCloseCollectionModal={handleCloseCollectionModal}
          formData={formData}
          setFormData={setFormData}
          games={games}
          handleSaveCollection={handleSaveCollection}
          isSaving={isSaving}
          isEditing={Boolean(editingCollectionId)}
        />

        <ConfirmDialog
          isOpen={Boolean(deleteTarget)}
          title="Видалити добірку?"
          message={`Добірку «${deleteTarget?.title ?? ""}» буде видалено без можливості відновлення.`}
          isPending={isDeleting}
          onClose={() => setDeleteTarget(null)}
          onConfirm={confirmDeleteCollection}
        />
      </main>

      <FeedbackMessage
        message={errorMessage}
        onDismiss={() => setErrorMessage(null)}
      />
      <Footer />
    </div>
  );
}

export default CollectionsPage;
