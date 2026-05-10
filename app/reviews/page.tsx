"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "../lib/supabaseClient";
import {
  type Game,
  type GameRow,
  type GameReaction,
  mapGameRowToGame,
} from "../data/gameTypes";
import Header from "../components/ui/Header";
import GameCard from "../components/reviews/GameCard";
import GameDetailsPanel from "../components/reviews/GameDetailsCard";
import AddReviewButton from "../components/reviews/AddReviewButton";
import AddReviewModal from "../components/reviews/AddReviewModal";
import GameGrid from "../components/reviews/GameGrid";
import ReviewsFilters from "../components/reviews/ReviewsFilter";

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

  function handleCloseAddModal() {
    setIsAddModalOpen(false);
    setEditingGameId(null);

    setFormData({
      title: "",
      coverImage: "",
      bannerImage: "",
      genres: "",
      platforms: "",
      status: "backlog",
      reaction: "average" as Game["reaction"],
      hoursPlayed: "",
      isFavorite: false,
      personalReview: "",
      steamUrl: "",
    });
  }

  useEffect(() => {
    async function fetchGames() {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("games")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching games:", error.message);
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
        alert(error.message);
        return;
      }

      const mappedGame = mapGameRowToGame(data as GameRow);

      setGames((prevGames) =>
        prevGames.map((game) =>
          game.id === editingGameId ? mappedGame : game,
        ),
      );

      setSelectedGame(mappedGame);
      setEditingGameId(null);
      setIsAddModalOpen(false);

      setFormData({
        title: "",
        coverImage: "",
        bannerImage: "",
        genres: "",
        platforms: "",
        status: "backlog",
        reaction: "average" as Game["reaction"],
        hoursPlayed: "",
        isFavorite: false,
        personalReview: "",
        steamUrl: "",
      });

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
      alert(error.message);
      return;
    }

    const mappedGame = mapGameRowToGame(data as GameRow);

    setGames((prevGames) => [mappedGame, ...prevGames]);
    setIsAddModalOpen(false);

    setFormData({
      title: "",
      coverImage: "",
      bannerImage: "",
      genres: "",
      platforms: "",
      status: "backlog",
      reaction: "average" as Game["reaction"],
      hoursPlayed: "",
      isFavorite: false,
      personalReview: "",
      steamUrl: "",
    });
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

  async function handleDeleteReview(gameId: string) {
    const confirmed = confirm("Are you sure you want to delete this review?");

    if (!confirmed) return;

    const { error } = await supabase.from("games").delete().eq("id", gameId);

    if (error) {
      console.error("Error deleting review:", error.message);
      alert(error.message);
      return;
    }

    setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
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
    return (
      <section className="w-full bg-zinc-900 px-16 py-20 text-white">
        <p className="text-zinc-400">Loading games...</p>
      </section>
    );
  }

  return (
    <div>
      <Header />
      <section className="w-full px-16 mt-7 py-20 text-white">
        <div className="">
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

        <div className="flex items-start gap-8 py-4">
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
          setIsAddModalOpen={setIsAddModalOpen}
          formData={formData}
          setFormData={setFormData}
          handleAddReview={handleAddReview}
          isSaving={isSaving}
        />
      </section>
    </div>
  );
}

export default Reviews;
