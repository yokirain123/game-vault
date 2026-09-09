import React from "react";
import Image from "next/image";
import DialogShell from "../../ui/DialogShell";
import { type Game } from "../../../data/gameTypes";

type CollectionFormData = {
  title: string;
  description: string;
  coverImage: string;
  gameIds: string[];
};

type AddCollectionModalProps = {
  isCollectionModalOpen: boolean;
  formData: CollectionFormData;
  setFormData: React.Dispatch<React.SetStateAction<CollectionFormData>>;
  games: Game[];
  handleSaveCollection: (event: React.FormEvent<HTMLFormElement>) => void;
  isSaving: boolean;
  isEditing: boolean;
  handleCloseCollectionModal: () => void;
};

const fieldClass =
  "min-h-12 w-full rounded-xl bg-zinc-800 px-4 py-3 text-base text-zinc-100 outline-none ring-1 ring-zinc-700 placeholder:text-zinc-500 focus:ring-2 focus:ring-[#59B292]";
const labelClass = "grid gap-2 text-sm font-bold text-zinc-200";

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
  function toggleGame(gameId: string) {
    setFormData((current) => ({
      ...current,
      gameIds: current.gameIds.includes(gameId)
        ? current.gameIds.filter((id) => id !== gameId)
        : [...current.gameIds, gameId],
    }));
  }

  return (
    <DialogShell
      isOpen={isCollectionModalOpen}
      onClose={handleCloseCollectionModal}
      title={isEditing ? "Редагувати добірку" : "Додати добірку"}
      description="Об’єднай ігри за темою, настроєм або жанром."
      maxWidthClass="max-w-3xl"
    >
      <form
        onSubmit={handleSaveCollection}
        noValidate
        aria-busy={isSaving}
        className="grid gap-4"
      >
        <label className={labelClass}>
          Назва добірки
          <input
            name="title"
            type="text"
            placeholder="Наприклад, Ігри для затишного вечора"
            value={formData.title}
            onChange={(event) => setFormData({ ...formData, title: event.target.value })}
            className={fieldClass}
            required
          />
        </label>

        <label className={labelClass}>
          Опис
          <textarea
            name="description"
            placeholder="Коротко поясни ідею добірки"
            rows={4}
            value={formData.description}
            onChange={(event) =>
              setFormData({ ...formData, description: event.target.value })
            }
            className={`${fieldClass} resize-none`}
          />
        </label>

        <label className={labelClass}>
          URL обкладинки
          <textarea
            name="coverImage"
            placeholder="https://..."
            rows={2}
            value={formData.coverImage}
            onChange={(event) => setFormData({ ...formData, coverImage: event.target.value })}
            className={`${fieldClass} resize-none`}
          />
        </label>

        <fieldset className="rounded-2xl bg-zinc-800 p-3 ring-1 ring-zinc-700 sm:p-4">
          <legend className="px-1 text-lg font-bold text-zinc-100">Ігри в добірці</legend>

          {games.length > 0 ? (
            <div className="mt-3 grid max-h-80 grid-cols-1 gap-3 overflow-y-auto overscroll-contain pr-1 sm:grid-cols-2 sm:pr-2">
              {games.map((game) => {
                const isSelected = formData.gameIds.includes(game.id);

                return (
                  <button
                    key={game.id}
                    type="button"
                    onClick={() => toggleGame(game.id)}
                    aria-pressed={isSelected}
                    className={`flex min-h-20 min-w-0 items-center gap-3 rounded-2xl p-3 text-left transition-colors ${
                      isSelected
                        ? "bg-[#59B292] text-zinc-950"
                        : "bg-zinc-900 text-zinc-100 hover:bg-zinc-700"
                    }`}
                  >
                    <Image
                      src={game.coverImage}
                      alt=""
                      width={80}
                      height={56}
                      unoptimized
                      className="h-14 w-16 shrink-0 rounded-xl object-cover sm:w-20"
                    />
                    <span className="min-w-0 break-words text-sm font-bold">
                      {game.title}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="mt-3 rounded-xl bg-zinc-900 p-4 text-sm text-zinc-400">
              Спочатку додай хоча б одну гру або рецензію.
            </p>
          )}
        </fieldset>

        <button
          type="submit"
          disabled={isSaving}
          className="mt-2 min-h-12 rounded-xl bg-[#59B292] px-5 py-3 font-bold text-zinc-950 transition-colors hover:bg-[#73d3b2] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving
            ? "Зберігаю..."
            : isEditing
              ? "Зберегти зміни"
              : "Зберегти добірку"}
        </button>
      </form>
    </DialogShell>
  );
}

export default AddCollectionModal;
