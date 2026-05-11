import React from "react";

type BacklogFormData = {
  title: string;
  coverImage: string;
  bannerImage: string;
  steamUrl: string;
  genres: string;
  platforms: string;
  personalReview: string;
};

type AddBacklogModalProps = {
  isBacklogModalOpen: boolean;
  setIsBacklogModalOpen: (value: boolean) => void;
  formData: BacklogFormData;
  setFormData: React.Dispatch<React.SetStateAction<BacklogFormData>>;
  handleSaveBacklogGame: (event: React.FormEvent<HTMLFormElement>) => void;
  isSaving: boolean;
  isEditing: boolean;
};

function AddBacklogModal({
  isBacklogModalOpen,
  setIsBacklogModalOpen,
  formData,
  setFormData,
  handleSaveBacklogGame,
  isSaving,
  isEditing,
}: AddBacklogModalProps) {
  if (!isBacklogModalOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-zinc-900 p-8 text-white shadow-2xl">
        <button
          type="button"
          onClick={() => setIsBacklogModalOpen(false)}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-xl transition hover:bg-zinc-700"
        >
          ×
        </button>

        <h3 className="mb-6 text-3xl font-bold">
          {isEditing ? "Edit backlog game" : "Add backlog game"}
        </h3>

        <form onSubmit={handleSaveBacklogGame} className="grid gap-4">
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
              setFormData({ ...formData, bannerImage: event.target.value })
            }
            className="resize-none rounded-xl bg-zinc-800 px-4 py-3 outline-none ring-1 ring-zinc-700 focus:ring-[#59B292]"
            required
          />

          <input
            type="url"
            placeholder="Steam URL"
            value={formData.steamUrl}
            onChange={(event) =>
              setFormData({ ...formData, steamUrl: event.target.value })
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

          <textarea
            placeholder="Why I want to play it"
            rows={5}
            value={formData.personalReview}
            onChange={(event) =>
              setFormData({ ...formData, personalReview: event.target.value })
            }
            className="resize-none rounded-xl bg-zinc-800 px-4 py-3 outline-none ring-1 ring-zinc-700 focus:ring-[#59B292]"
          />

          <button
            type="submit"
            disabled={isSaving}
            className="mt-2 rounded-xl bg-[#59B292] px-5 py-3 font-bold text-zinc-900 transition hover:bg-[#73d3b2] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving
              ? "Saving..."
              : isEditing
                ? "Save changes"
                : "Add to backlog"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddBacklogModal;