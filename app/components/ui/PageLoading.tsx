import Header from "./Header";

type PageLoadingProps = {
  label?: string;
};

function PageLoading({ label = "Завантажую..." }: PageLoadingProps) {
  return (
    <div className="min-h-dvh bg-background text-main">
      <Header />
      <main className="page-container flex min-h-[70svh] items-center justify-center pb-16 pt-28 sm:pt-32">
        <div role="status" className="flex flex-col items-center gap-4 text-main/60">
          <span
            aria-hidden="true"
            className="h-10 w-10 animate-spin rounded-full border-2 border-bg-alt border-t-accent"
          />
          <span>{label}</span>
        </div>
      </main>
    </div>
  );
}

export default PageLoading;
