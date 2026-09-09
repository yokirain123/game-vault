import React from "react";
import DialogShell from "../../ui/DialogShell";

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
  onClose: () => void;
  formData: BacklogFormData;
  setFormData: React.Dispatch<React.SetStateAction<BacklogFormData>>;
  handleSaveBacklogGame: (event: React.FormEvent<HTMLFormElement>) => void;
  isSaving: boolean;
  isEditing: boolean;
};

const fieldClass =
  "min-h-12 w-full rounded-xl bg-zinc-800 px-4 py-3 text-base text-zinc-100 outline-none ring-1 ring-zinc-700 placeholder:text-zinc-500 focus:ring-2 focus:ring-[#59B292]";
const labelClass = "grid gap-2 text-sm font-bold text-zinc-200";

function AddBacklogModal({
  isBacklogModalOpen,
  onClose,
  formData,
  setFormData,
  handleSaveBacklogGame,
  isSaving,
  isEditing,
}: AddBacklogModalProps) {
  return (
    <DialogShell
      isOpen={isBacklogModalOpen}
      onClose={onClose}
      title={isEditing ? "Редагувати гру в беклозі" : "Додати гру в беклог"}
      description="Збережи гру, до якої хочеш повернутися пізніше."
    >
      <form
        onSubmit={handleSaveBacklogGame}
        noValidate
        aria-busy={isSaving}
        className="grid gap-4"
      >
        <label className={labelClass}>
          Назва гри
          <input
            name="title"
            type="text"
            placeholder="Наприклад, Hollow Knight"
            value={formData.title}
            onChange={(event) => setFormData({ ...formData, title: event.target.value })}
            className={fieldClass}
            required
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
            required
          />
        </label>

        <label className={labelClass}>
          URL банера
          <textarea
            name="bannerImage"
            placeholder="https://..."
            rows={2}
            value={formData.bannerImage}
            onChange={(event) => setFormData({ ...formData, bannerImage: event.target.value })}
            className={`${fieldClass} resize-none`}
            required
          />
        </label>

        <label className={labelClass}>
          Посилання на Steam
          <input
            name="steamUrl"
            type="url"
            placeholder="https://store.steampowered.com/..."
            value={formData.steamUrl}
            onChange={(event) => setFormData({ ...formData, steamUrl: event.target.value })}
            className={fieldClass}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Жанри
            <input
              name="genres"
              type="text"
              placeholder="Metroidvania, Indie"
              value={formData.genres}
              onChange={(event) => setFormData({ ...formData, genres: event.target.value })}
              className={fieldClass}
              required
            />
          </label>
          <label className={labelClass}>
            Платформи
            <input
              name="platforms"
              type="text"
              placeholder="PC, Switch"
              value={formData.platforms}
              onChange={(event) => setFormData({ ...formData, platforms: event.target.value })}
              className={fieldClass}
              required
            />
          </label>
        </div>

        <label className={labelClass}>
          Чому хочу зіграти
          <textarea
            name="personalReview"
            placeholder="Коротка нотатка для себе"
            rows={5}
            value={formData.personalReview}
            onChange={(event) => setFormData({ ...formData, personalReview: event.target.value })}
            className={`${fieldClass} resize-none`}
          />
        </label>

        <button
          type="submit"
          disabled={isSaving}
          className="mt-2 min-h-12 rounded-xl bg-[#59B292] px-5 py-3 font-bold text-zinc-950 transition-colors hover:bg-[#73d3b2] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving
            ? "Зберігаю..."
            : isEditing
              ? "Зберегти зміни"
              : "Додати в беклог"}
        </button>
      </form>
    </DialogShell>
  );
}

export default AddBacklogModal;
