import React from "react";
import { type Game } from "../../../data/gameTypes";

type AddReviewModalProps = {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (value: boolean) => void;
  formData: {
    title: string;
    coverImage: string;
    bannerImage: string;
    genres: string;
    reaction: Game["reaction"];
    platforms: string;
    status: Game["status"];

    hoursPlayed: string;
    isFavorite: boolean;
    personalReview: string;
    steamUrl: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      title: string;
      coverImage: string;
      bannerImage: string;
      genres: string;
      reaction: Game["reaction"];
      platforms: string;
      status: Game["status"];

      hoursPlayed: string;
      isFavorite: boolean;
      personalReview: string;
      steamUrl: string;
    }>
  >;
  handleAddReview: (event: React.FormEvent<HTMLFormElement>) => void;
  isSaving: boolean;
};

function AddReviewModal({
  isAddModalOpen,
  setIsAddModalOpen,
  formData,
  setFormData,
  handleAddReview,
  isSaving,
}: AddReviewModalProps) {
  if (!isAddModalOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-zinc-900 p-8 text-accent shadow-2xl">
        <button
          type="button"
          onClick={() => setIsAddModalOpen(false)}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-xl transition hover:bg-zinc-700"
        >
          ×
        </button>

        <h3 className="mb-6 text-3xl font-bold">Add new review</h3>

        <form onSubmit={handleAddReview} className="grid gap-4">
          <input
            type="text"
            placeholder="Game title"
            value={formData.title}
            onChange={(event) =>
              setFormData({ ...formData, title: event.target.value })
            }
            className="rounded-xl bg-zinc-800 px-4 py-3 outline-none ring-1 ring-zinc-700 focus:ring-[#59B292]"
            required
          />

          <textarea
            placeholder="Paste cover image URL"
            rows={3}
            value={formData.coverImage}
            onChange={(event) =>
              setFormData({ ...formData, coverImage: event.target.value })
            }
            className="resize-none rounded-xl bg-zinc-800 px-4 py-3 outline-none ring-1 ring-zinc-700 focus:ring-[#59B292]"
            required
          />

          <textarea
            placeholder="Paste banner image URL"
            rows={3}
            value={formData.bannerImage}
            onChange={(event) =>
              setFormData({
                ...formData,
                bannerImage: event.target.value,
              })
            }
            className="resize-none rounded-xl bg-zinc-800 px-4 py-3 outline-none ring-1 ring-zinc-700 focus:ring-[#59B292]"
            required
          />
          <input
            type="url"
            placeholder="Steam URL"
            value={formData.steamUrl}
            onChange={(event) =>
              setFormData({
                ...formData,
                steamUrl: event.target.value,
              })
            }
            className="rounded-xl bg-zinc-800 px-4 py-3 outline-none ring-1 ring-zinc-700 focus:ring-[#59B292]"
          />

          <input
            type="text"
            placeholder="Genres, separated by comma"
            value={formData.genres}
            onChange={(event) =>
              setFormData({ ...formData, genres: event.target.value })
            }
            className="rounded-xl bg-zinc-800 px-4 py-3 outline-none ring-1 ring-zinc-700 focus:ring-[#59B292]"
            required
          />

          <input
            type="text"
            placeholder="Platforms, separated by comma"
            value={formData.platforms}
            onChange={(event) =>
              setFormData({ ...formData, platforms: event.target.value })
            }
            className="rounded-xl bg-zinc-800 px-4 py-3 outline-none ring-1 ring-zinc-700 focus:ring-[#59B292]"
            required
          />

          <select
            value={formData.status}
            onChange={(event) =>
              setFormData({
                ...formData,
                status: event.target.value as Game["status"],
              })
            }
            className="rounded-xl bg-zinc-800 px-4 py-3 outline-none ring-1 ring-zinc-700 focus:ring-[#59B292]"
          >
            <option value="backlog">Беклог</option>
            <option value="playing">Граю</option>
            <option value="completed">Завершено</option>
            <option value="dropped">Кинуто</option>
          </select>

          <select
            value={formData.reaction}
            onChange={(event) =>
              setFormData({
                ...formData,
                reaction: event.target.value as Game["reaction"],
              })
            }
            className="rounded-xl bg-zinc-800 px-4 py-3 outline-none ring-1 ring-zinc-700 focus:ring-[#59B292]"
            required
          >
            <option value="masterpiece">🔥 Шедевр</option>
            <option value="recommend">👍 Рекомендую</option>
            <option value="chill">🍺 Під пиво піде</option>
            <option value="average">😐 Так собі</option>
            <option value="terrible">👎 Жахливо</option>
          </select>

          <input
            type="number"
            placeholder="Hours played"
            min="0"
            step="0.1"
            value={formData.hoursPlayed}
            onChange={(event) =>
              setFormData({
                ...formData,
                hoursPlayed: event.target.value,
              })
            }
            className="rounded-xl bg-zinc-800 px-4 py-3 outline-none ring-1 ring-zinc-700 focus:ring-[#59B292]"
          />

          <label className="flex items-center gap-3 rounded-xl bg-zinc-800 px-4 py-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={formData.isFavorite}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  isFavorite: event.target.checked,
                })
              }
            />
            Favorite game
          </label>

          <textarea
            placeholder="Personal review"
            rows={4}
            value={formData.personalReview}
            onChange={(event) =>
              setFormData({
                ...formData,
                personalReview: event.target.value,
              })
            }
            className="resize-none rounded-xl bg-zinc-800 px-4 py-3 outline-none ring-1 ring-zinc-700 focus:ring-[#59B292]"
          />

          <button
            type="submit"
            disabled={isSaving}
            className="mt-2 rounded-xl bg-[#59B292] px-5 py-3 font-bold text-zinc-900 transition hover:bg-[#73d3b2] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save review"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddReviewModal;
