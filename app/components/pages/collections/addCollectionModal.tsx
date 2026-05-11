import React from "react";
import { type Game } from "../../../data/gameTypes";

type CollectionFormData = {
  title: string;
  description: string;
  coverImage: string;
  gameIds: string[];
};

type AddCollectionModalProps = {
  isCollectionModalOpen: boolean;
  setIsCollectionModalOpen: (value: boolean) => void;
  formData: CollectionFormData;
  setFormData: React.Dispatch<React.SetStateAction<CollectionFormData>>;
  games: Game[];
  handleSaveCollection: (event: React.FormEvent<HTMLFormElement>) => void;
  isSaving: boolean;
  isEditing: boolean;
handleCloseCollectionModal: () => void;
};

function AddCollectionModal({
  isCollectionModalOpen,
  handleCloseCollectionModal,
  formData,
  setFormData,
  games,
  handleSaveCollection,
  isSaving,
  isEditing,
}: AddCollectionModalProps) {
  if (!isCollectionModalOpen) return null;

  function toggleGame(gameId: string) {
    setFormData((prev) => ({
      ...prev,
      gameIds: prev.gameIds.includes(gameId)
        ? prev.gameIds.filter((id) => id !== gameId)
        : [...prev.gameIds, gameId],
    }));
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-zinc-900 p-8 text-white shadow-2xl">
        <button
  type="button"
  onClick={handleCloseCollectionModal}
  className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-xl transition hover:bg-zinc-700"
>
  ×
</button>

        <h3 className="mb-6 text-3xl font-bold">
  {isEditing ? "Edit collection" : "Add collection"}
</h3>

        <form onSubmit={handleSaveCollection} className="grid gap-4">
          <input
            type="text"
            placeholder="Collection title"
            value={formData.title}
            onChange={(event) =>
              setFormData({ ...formData, title: event.target.value })
            }
            className="rounded-xl bg-zinc-800 px-4 py-3 outline-none ring-1 ring-zinc-700 focus:ring-[#59B292]"
            required
          />

          <textarea
            placeholder="Collection description"
            rows={4}
            value={formData.description}
            onChange={(event) =>
              setFormData({ ...formData, description: event.target.value })
            }
            className="resize-none rounded-xl bg-zinc-800 px-4 py-3 outline-none ring-1 ring-zinc-700 focus:ring-[#59B292]"
          />

          <textarea
            placeholder="Cover image URL"
            rows={3}
            value={formData.coverImage}
            onChange={(event) =>
              setFormData({ ...formData, coverImage: event.target.value })
            }
            className="resize-none rounded-xl bg-zinc-800 px-4 py-3 outline-none ring-1 ring-zinc-700 focus:ring-[#59B292]"
          />

          <div className="rounded-2xl bg-zinc-800 p-4">
            <h4 className="mb-4 text-lg font-bold">Games in collection</h4>

            <div className="grid max-h-80 grid-cols-1 gap-3 overflow-y-auto pr-2 sm:grid-cols-2">
              {games.map((game) => {
                const isSelected = formData.gameIds.includes(game.id);

                return (
                  <button
                    key={game.id}
                    type="button"
                    onClick={() => toggleGame(game.id)}
                    className={`
                      flex items-center gap-3 rounded-2xl p-3 text-left transition
                      ${
                        isSelected
                          ? "bg-[#59B292] text-zinc-950"
                          : "bg-zinc-900 text-white hover:bg-zinc-700"
                      }
                    `}
                  >
                    <img
                      src={game.coverImage}
                      alt={game.title}
                      className="h-14 w-20 rounded-xl object-cover"
                    />

                    <span className="text-sm font-bold">{game.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
  type="submit"
  disabled={isSaving}
  className="mt-2 rounded-xl bg-[#59B292] px-5 py-3 font-bold text-zinc-900 transition hover:bg-[#73d3b2] disabled:cursor-not-allowed disabled:opacity-60"
>
  {isSaving
    ? "Saving..."
    : isEditing
      ? "Save changes"
      : "Save collection"}
</button>
        </form>
      </div>
    </div>
  );
}

export default AddCollectionModal;