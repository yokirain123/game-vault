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
      className="
        fixed bottom-6 right-6 z-50
        flex h-14 w-14 items-center justify-center
        rounded-full bg-[#59B292] text-3xl font-bold text-zinc-950
        shadow-lg shadow-black/30
        transition-all duration-300
        hover:scale-110 hover:bg-[#73d3b2]
      "
    >
      +
    </button>
  );
}

export default AddCollectionButton;
