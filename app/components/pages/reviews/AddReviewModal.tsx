import React from "react";
import DialogShell from "../../ui/DialogShell";
import { type Game } from "../../../data/gameTypes";

type ReviewFormData = {
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

type AddReviewModalProps = {
  isAddModalOpen: boolean;
  onClose: () => void;
  formData: ReviewFormData;
  setFormData: React.Dispatch<React.SetStateAction<ReviewFormData>>;
  handleAddReview: (event: React.FormEvent<HTMLFormElement>) => void;
  isSaving: boolean;
  isEditing: boolean;
};

const fieldClass =
  "min-h-12 w-full rounded-xl bg-zinc-800 px-4 py-3 text-base text-zinc-100 outline-none ring-1 ring-zinc-700 placeholder:text-zinc-500 focus:ring-2 focus:ring-[#59B292]";
const labelClass = "grid gap-2 text-sm font-bold text-zinc-200";

function AddReviewModal({
  isAddModalOpen,
  onClose,
  formData,
  setFormData,
  handleAddReview,
  isSaving,
  isEditing,
}: AddReviewModalProps) {
  return (
    <DialogShell
      isOpen={isAddModalOpen}
      onClose={onClose}
      title={isEditing ? "Редагувати рецензію" : "Додати рецензію"}
      description="Заповни основну інформацію про гру. Обкладинка використовується в каталозі, банер — у деталях."
    >
      <form
        onSubmit={handleAddReview}
        noValidate
        aria-busy={isSaving}
        className="grid gap-4"
      >
        <label className={labelClass}>
          Назва гри
          <input
            name="title"
            type="text"
            placeholder="Наприклад, Hades"
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
              placeholder="Action, RPG"
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
              placeholder="PC, PlayStation 5"
              value={formData.platforms}
              onChange={(event) => setFormData({ ...formData, platforms: event.target.value })}
              className={fieldClass}
              required
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Статус
            <select
              value={formData.status}
              onChange={(event) =>
                setFormData({ ...formData, status: event.target.value as Game["status"] })
              }
              className={fieldClass}
            >
              <option value="backlog">Беклог</option>
              <option value="playing">Граю</option>
              <option value="completed">Завершено</option>
              <option value="dropped">Кинуто</option>
            </select>
          </label>
          <label className={labelClass}>
            Реакція
            <select
              value={formData.reaction}
              onChange={(event) =>
                setFormData({ ...formData, reaction: event.target.value as Game["reaction"] })
              }
              className={fieldClass}
              required
            >
              <option value="masterpiece">🔥 Шедевр</option>
              <option value="recommend">👍 Рекомендую</option>
              <option value="chill">🍺 Під пиво піде</option>
              <option value="average">😐 Так собі</option>
              <option value="terrible">👎 Жахливо</option>
            </select>
          </label>
        </div>

        <label className={labelClass}>
          Годин зіграно
          <input
            type="number"
            placeholder="0"
            min="0"
            step="0.1"
            inputMode="decimal"
            value={formData.hoursPlayed}
            onChange={(event) => setFormData({ ...formData, hoursPlayed: event.target.value })}
            className={fieldClass}
          />
        </label>

        <label className="flex min-h-12 items-center gap-3 rounded-xl bg-zinc-800 px-4 py-3 text-sm font-bold text-zinc-200 ring-1 ring-zinc-700">
          <input
            type="checkbox"
            checked={formData.isFavorite}
            onChange={(event) => setFormData({ ...formData, isFavorite: event.target.checked })}
            className="h-5 w-5 accent-[#59B292]"
          />
          Улюблена гра
        </label>

        <label className={labelClass}>
          Особиста рецензія
          <textarea
            name="personalReview"
            placeholder="Що сподобалось і які враження залишила гра?"
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
          {isSaving ? "Зберігаю..." : isEditing ? "Зберегти зміни" : "Зберегти рецензію"}
        </button>
      </form>
    </DialogShell>
  );
}

export default AddReviewModal;
