"use client";

import React, { useEffect, useState } from "react";
import Header from "../components/ui/Header";
import { createClient } from "../lib/supabaseClient";
import { type Game, type GameRow, mapGameRowToGame } from "../data/gameTypes";
import AddBacklogButton from "../components/pages/backlog/addBacklogButton";
import AddBacklogModal from "../components/pages/backlog/addBacklogModal";
import BacklogDetailsCard from "../components/pages/backlog/BacklogDetailsCard";
import BacklogGrid from "../components/pages/backlog/BacklogGrid";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
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
      setIsBacklogModalOpen(false);
      resetForm();

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
      alert(error.message);
      return;
    }

    const mappedGame = mapGameRowToGame(data as GameRow);

    setGames((prevGames) => [mappedGame, ...prevGames]);
    setIsBacklogModalOpen(false);
    resetForm();
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

  async function handleDeleteBacklogGame(gameId: string) {
    const confirmed = confirm("Are you sure you want to delete this backlog game?");

    if (!confirmed) return;

    const { error } = await supabase.from("games").delete().eq("id", gameId);

    if (error) {
      console.error("Error deleting backlog game:", error.message);
      alert(error.message);
      return;
    }

    setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
    setSelectedGame(null);
  }

  if (isLoading) {
    return (
      <section>
        <Header />
      </section>
    );
  }

  return (
    <div>
      <Header />

      <section className="w-full px-16 mt-7 pt-20 text-white">
        <div className="mb-4">
          <h1 className="text-5xl font-bold">Беклог</h1>
          <p className="mt-3 text-zinc-400">
            Ігри, до яких я ще хочу добратись.
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
          setIsBacklogModalOpen={setIsBacklogModalOpen}
          formData={formData}
          setFormData={setFormData}
          handleSaveBacklogGame={handleSaveBacklogGame}
          isSaving={isSaving}
          isEditing={Boolean(editingGameId)}
        />
      </section>
    </div>
  );
}

export default BacklogPage;