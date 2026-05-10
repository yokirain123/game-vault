type AddReviewButtonProps = {
  isAdmin: boolean;
  setIsAddModalOpen: (value: boolean) => void;
};

function AddReviewButton({
  isAdmin,
  setIsAddModalOpen,
}: AddReviewButtonProps) {
  if (!isAdmin) return null;

  return (
    <button
      type="button"
      onClick={() => setIsAddModalOpen(true)}
      title="Add review"
      className="
        fixed bottom-6 right-6 z-50
        flex h-10 w-10 items-center justify-center
        rounded-full bg-[#59B292] text-3xl font-bold text-zinc-950
        transition-all duration-300
        hover:bg-[#73d3b2]
      "
    >
      +
    </button>
  );
}

export default AddReviewButton;