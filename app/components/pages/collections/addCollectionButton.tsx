type AddCollectionButtonProps = {
  isAdmin: boolean;
  setIsCollectionModalOpen: (value: boolean) => void;
};

function AddCollectionButton({
  isAdmin,
  setIsCollectionModalOpen,
}: AddCollectionButtonProps) {
  if (!isAdmin) return null;

  return (
    <button
      type="button"
      onClick={() => setIsCollectionModalOpen(true)}
      title="Add collection"
      aria-label="Додати добірку"
      className="
        fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-50
        flex h-14 w-14 items-center justify-center sm:right-6
        rounded-full bg-[#59B292] text-3xl font-bold text-zinc-950
        shadow-lg shadow-black/30
        transition-[transform,background-color] duration-300
        hover:scale-105 hover:bg-[#73d3b2]
      "
    >
      +
    </button>
  );
}

export default AddCollectionButton;
