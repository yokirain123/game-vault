"use client";

import React, { useEffect, useState } from "react";
import Header from "../components/ui/Header";
import { createClient } from "../data/supabaseClient";
import { type Game, type GameRow, mapGameRowToGame } from "../data/gameTypes";
import AddBacklogButton from "../components/pages/backlog/addBacklogButton";
import AddBacklogModal from "../components/pages/backlog/addBacklogModal";
import BacklogDetailsCard from "../components/pages/backlog/BacklogDetailsCard";
import BacklogGrid from "../components/pages/backlog/BacklogGrid";
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

function BacklogPage() {
  const supabase = createClient();

  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [isBacklogModalOpen, setIsBacklogModalOpen] = useState(false);
  const [editingGameId, setEditingGameId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Game | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    coverImage: "",
    bannerImage: "",
    steamUrl: "",
    genres: "",
    platforms: "",
    personalReview: "",
  });

  function resetForm() {
    setFormData({
      title: "",
      coverImage: "",
      bannerImage: "",
      steamUrl: "",
      genres: "",
      platforms: "",
      personalReview: "",
    });
  }

  function handleCloseBacklogModal() {
    setIsBacklogModalOpen(false);
    setEditingGameId(null);
    resetForm();
  }

  useEffect(() => {
    async function fetchBacklogGames() {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("games")
        .select("*")
        .eq("status", "backlog")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching backlog:", error.message);
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      setGames((data as GameRow[]).map(mapGameRowToGame));
      setIsLoading(false);
    }

    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setIsAdmin(user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL);
    }

    fetchBacklogGames();
    checkAdmin();
  }, [supabase]);

  async function handleSaveBacklogGame(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage(null);

    const requiredFields = [
      { name: "title", value: formData.title, label: "Назва гри" },
      { name: "coverImage", value: formData.coverImage, label: "URL обкладинки" },
      { name: "bannerImage", value: formData.bannerImage, label: "URL банера" },
      { name: "genres", value: formData.genres, label: "Жанри" },
      { name: "platforms", value: formData.platforms, label: "Платформи" },
    ];
    const firstMissingField = requiredFields.find(({ value }) => !value.trim());

    if (firstMissingField) {
      setErrorMessage(`Заповни поле «${firstMissingField.label}».`);
      focusFormControl(event.currentTarget, firstMissingField.name);
      return;
    }

    const urlFields = [
      { name: "coverImage", value: formData.coverImage, label: "URL обкладинки" },
      { name: "bannerImage", value: formData.bannerImage, label: "URL банера" },
      { name: "steamUrl", value: formData.steamUrl, label: "Посилання на Steam" },
    ];
    const firstInvalidUrl = urlFields.find(({ value }) => !isValidHttpUrl(value));

    if (firstInvalidUrl) {
      setErrorMessage(`Поле «${firstInvalidUrl.label}» має містити коректне http(s)-посилання.`);
      focusFormControl(event.currentTarget, firstInvalidUrl.name);
      return;
    }

    setIsSaving(true);

    const backlogGame = {
      slug: createSlug(formData.title),
      title: formData.title,
      cover_image: formData.coverImage,
      banner_image: formData.bannerImage,
      genres: formData.genres
        .split(",")
        .map((genre) => genre.trim())
        .filter(Boolean),
      platforms: formData.platforms
        .split(",")
        .map((platform) => platform.trim())
        .filter(Boolean),
      status: "backlog" as Game["status"],
      reaction: "average" as Game["reaction"],
      hours_played: null,
      is_favorite: false,
      personal_review: formData.personalReview || null,
      steam_url: formData.steamUrl || null,
    };

    if (editingGameId) {
      const { data, error } = await supabase
        .from("games")
        .update(backlogGame)
        .eq("id", editingGameId)
        .select()
        .single();

      setIsSaving(false);

      if (error) {
        console.error("Error updating backlog game:", error.message);
        setErrorMessage(error.message);
        return;
      }

      const mappedGame = mapGameRowToGame(data as GameRow);

      setGames((prevGames) =>
        prevGames.map((game) =>
          game.id === editingGameId ? mappedGame : game,
        ),
      );

      setSelectedGame(mappedGame);
      handleCloseBacklogModal();

      return;
    }

    const { data, error } = await supabase
      .from("games")
      .insert(backlogGame)
      .select()
      .single();

    setIsSaving(false);

    if (error) {
      console.error("Error adding backlog game:", error.message);
      setErrorMessage(error.message);
      return;
    }

    const mappedGame = mapGameRowToGame(data as GameRow);

    setGames((prevGames) => [mappedGame, ...prevGames]);
    handleCloseBacklogModal();
  }

  function handleEditBacklogGame(game: Game) {
    setEditingGameId(game.id);

    setFormData({
      title: game.title,
      coverImage: game.coverImage,
      bannerImage: game.bannerImage,
      steamUrl: game.steamUrl || "",
      genres: game.genres.join(", "),
      platforms: game.platforms.join(", "),
      personalReview: game.personalReview || "",
    });

    setIsBacklogModalOpen(true);
  }

  function handleDeleteBacklogGame(gameId: string) {
    setDeleteTarget(games.find((game) => game.id === gameId) ?? null);
  }

  async function confirmDeleteBacklogGame() {
    if (!deleteTarget) return;

    setErrorMessage(null);
    setIsDeleting(true);

    const { error } = await supabase
      .from("games")
      .delete()
      .eq("id", deleteTarget.id);

    setIsDeleting(false);

    if (error) {
      console.error("Error deleting backlog game:", error.message);
      setErrorMessage(error.message);
      return;
    }

    setGames((prevGames) =>
      prevGames.filter((game) => game.id !== deleteTarget.id),
    );
    setDeleteTarget(null);
    setSelectedGame(null);
  }

  if (isLoading) {
    return <PageLoading label="Завантажую беклог..." />;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      <main className="page-container flex-1 pb-16 pt-24 text-main sm:pt-28 lg:pt-32">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-3xl font-bold sm:text-5xl">Беклог</h1>
          <p className="mt-3 max-w-2xl text-main/60">
            Ігри, до яких я ще хочу добратись.
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
            isAdmin={isAdmin}
            setSelectedGame={setSelectedGame}
            handleDeleteReview={handleDeleteBacklogGame}
            handleEditReview={handleEditBacklogGame}
          />
        </div>

        <AddBacklogButton
          isAdmin={isAdmin}
          setIsBacklogModalOpen={setIsBacklogModalOpen}
        />

        <AddBacklogModal
          isBacklogModalOpen={isBacklogModalOpen}
          onClose={handleCloseBacklogModal}
          formData={formData}
          setFormData={setFormData}
          handleSaveBacklogGame={handleSaveBacklogGame}
          isSaving={isSaving}
          isEditing={Boolean(editingGameId)}
        />

        <ConfirmDialog
          isOpen={Boolean(deleteTarget)}
          title="Видалити гру з беклогу?"
          message={`Гру «${deleteTarget?.title ?? ""}» буде видалено без можливості відновлення.`}
          isPending={isDeleting}
          onClose={() => setDeleteTarget(null)}
          onConfirm={confirmDeleteBacklogGame}
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

export default BacklogPage;
