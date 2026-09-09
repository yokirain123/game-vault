"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "../data/supabaseClient";
import {
  type Game,
  type GameRow,
  type GameReaction,
  mapGameRowToGame,
} from "../data/gameTypes";
import Header from "../components/ui/Header";
import GameDetailsPanel from "../components/pages/reviews/GameDetailsCard";
import AddReviewButton from "../components/pages/reviews/AddReviewButton";
import AddReviewModal from "../components/pages/reviews/AddReviewModal";
import GameGrid from "../components/pages/reviews/GameGrid";
import ReviewsFilters from "../components/pages/reviews/ReviewsFilter";
import Footer from "../components/ui/Footer";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import FeedbackMessage from "../components/ui/FeedbackMessage";
import PageLoading from "../components/ui/PageLoading";
import { focusFormControl, isValidHttpUrl } from "../data/formValidation";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function Reviews() {
  const supabase = createClient();

  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGameId, setEditingGameId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Game | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    coverImage: "",
    bannerImage: "",
    genres: "",
    platforms: "",
    status: "backlog" as Game["status"],
    reaction: "average" as Game["reaction"],
    hoursPlayed: "",
    isFavorite: false,
    personalReview: "",
    steamUrl: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedReaction, setSelectedReaction] = useState<
    GameReaction | "all"
  >("all");

  function resetReviewForm() {
    setFormData({
      title: "",
      coverImage: "",
      bannerImage: "",
      genres: "",
      platforms: "",
      status: "backlog",
      reaction: "average",
      hoursPlayed: "",
      isFavorite: false,
      personalReview: "",
      steamUrl: "",
    });
  }

  function handleCloseReviewModal() {
    setIsAddModalOpen(false);
    setEditingGameId(null);
    resetReviewForm();
  }

  useEffect(() => {
    async function fetchGames() {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("games")
        .select("*")
        .neq("status", "backlog")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching games:", error.message);
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      const mappedGames = (data as GameRow[]).map(mapGameRowToGame);

      setGames(mappedGames);
      setIsLoading(false);
    }

    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setIsAdmin(user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL);
    }

    fetchGames();
    checkAdmin();
  }, [supabase]);

  async function handleAddReview(event: React.FormEvent<HTMLFormElement>) {
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

    const newGame = {
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
      status: formData.status,
      reaction: formData.reaction,
      hours_played: formData.hoursPlayed
        ? Number(formData.hoursPlayed.replace(",", "."))
        : null,
      is_favorite: formData.isFavorite,
      personal_review: formData.personalReview || null,
      steam_url: formData.steamUrl || null,
    };

    if (editingGameId) {
      const { data, error } = await supabase
        .from("games")
        .update(newGame)
        .eq("id", editingGameId)
        .select()
        .single();

      setIsSaving(false);

      if (error) {
        console.error("Error updating review:", error.message);
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
      handleCloseReviewModal();

      return;
    }

    const { data, error } = await supabase
      .from("games")
      .insert(newGame)
      .select()
      .single();

    setIsSaving(false);

    if (error) {
      console.error("Error adding review:", error.message);
      setErrorMessage(error.message);
      return;
    }

    const mappedGame = mapGameRowToGame(data as GameRow);

    setGames((prevGames) => [mappedGame, ...prevGames]);
    handleCloseReviewModal();
  }

  function handleEditReview(game: Game) {
    setEditingGameId(game.id);

    setFormData({
      title: game.title,
      coverImage: game.coverImage,
      bannerImage: game.bannerImage,
      genres: game.genres.join(", "),
      platforms: game.platforms.join(", "),
      status: game.status,
      reaction: game.reaction,
      hoursPlayed: game.hoursPlayed ? String(game.hoursPlayed) : "",
      isFavorite: game.isFavorite,
      personalReview: game.personalReview || "",
      steamUrl: game.steamUrl || "",
    });

    setIsAddModalOpen(true);
  }

  function handleDeleteReview(gameId: string) {
    setDeleteTarget(games.find((game) => game.id === gameId) ?? null);
  }

  async function confirmDeleteReview() {
    if (!deleteTarget) return;

    setErrorMessage(null);
    setIsDeleting(true);

    const { error } = await supabase
      .from("games")
      .delete()
      .eq("id", deleteTarget.id);

    setIsDeleting(false);

    if (error) {
      console.error("Error deleting review:", error.message);
      setErrorMessage(error.message);
      return;
    }

    setGames((prevGames) =>
      prevGames.filter((game) => game.id !== deleteTarget.id),
    );
    setDeleteTarget(null);
    setSelectedGame(null);
  }

  const availableGenres = Array.from(
    new Set(games.flatMap((game) => game.genres)),
  ).sort();

  const filteredGames = games.filter((game) => {
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch = !query || game.title.toLowerCase().includes(query);

    const matchesGenre =
      selectedGenres.length === 0 ||
      selectedGenres.some((genre) => game.genres.includes(genre));

    const matchesReaction =
      selectedReaction === "all" || game.reaction === selectedReaction;

    return matchesSearch && matchesGenre && matchesReaction;
  });

  function resetFilters() {
    setSearchQuery("");
    setSelectedGenres([]);
    setSelectedReaction("all");
  }

  if (isLoading) {
    return <PageLoading label="Завантажую рецензії..." />;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="page-container flex-1 pb-16 pt-24 text-main sm:pt-28 lg:pt-32">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-3xl font-bold text-main sm:text-5xl">Ігрові рецензії</h1>
          <p className="mt-3 max-w-2xl text-main/60">
            Враження від пройдених ігор — від шедеврів до тих, які краще пропустити.
          </p>
        </header>

        <div>
          <ReviewsFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedGenres={selectedGenres}
            setSelectedGenres={setSelectedGenres}
            selectedReaction={selectedReaction}
            setSelectedReaction={setSelectedReaction}
            availableGenres={availableGenres}
            resetFilters={resetFilters}
          />
          <AddReviewButton
            isAdmin={isAdmin}
            setIsAddModalOpen={setIsAddModalOpen}
          />
        </div>

        <div
          className={`flex min-w-0 items-start pt-6 lg:pt-8 ${
            selectedGame ? "lg:gap-8" : "lg:gap-0"
          }`}
        >
          <GameGrid
            games={filteredGames}
            selectedGame={selectedGame}
            onSelectGame={setSelectedGame}
          />

          <GameDetailsPanel
            selectedGame={selectedGame}
            isAdmin={isAdmin}
            setSelectedGame={setSelectedGame}
            handleDeleteReview={handleDeleteReview}
            handleEditReview={handleEditReview}
          />
        </div>
        <AddReviewModal
          isAddModalOpen={isAddModalOpen}
          onClose={handleCloseReviewModal}
          formData={formData}
          setFormData={setFormData}
          handleAddReview={handleAddReview}
          isSaving={isSaving}
          isEditing={Boolean(editingGameId)}
        />

        <ConfirmDialog
          isOpen={Boolean(deleteTarget)}
          title="Видалити рецензію?"
          message={`Рецензію «${deleteTarget?.title ?? ""}» буде видалено без можливості відновлення.`}
          isPending={isDeleting}
          onClose={() => setDeleteTarget(null)}
          onConfirm={confirmDeleteReview}
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

export default Reviews;
