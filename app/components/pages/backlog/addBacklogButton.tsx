type AddBacklogButtonProps = {
  isAdmin: boolean;
  setIsBacklogModalOpen: (value: boolean) => void;
};

function AddBacklogButton({
  isAdmin,
  setIsBacklogModalOpen,
}: AddBacklogButtonProps) {
  if (!isAdmin) return null;

  return (
    <button
      type="button"
      onClick={() => setIsBacklogModalOpen(true)}
      title="Add backlog game"
      className="
        fixed bottom-6 right-6 z-50
        flex h-10 w-10 items-center justify-center
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

export default AddBacklogButton;
