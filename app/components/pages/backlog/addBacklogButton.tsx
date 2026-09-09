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
      aria-label="Додати гру в беклог"
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

export default AddBacklogButton;
