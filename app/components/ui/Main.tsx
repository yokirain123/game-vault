import Image from "next/image";
import Placeholder from "../images/placeholder.avif";
import Link from "next/link";

function Main() {
  return (
    <main className="px-12">
      <div className="flex flex-row items-center gap-12 px-60">
        <div className="text-center items-center text-2xl gap-6 flex flex-col">
          <p>Цікаво дізнатись думку про свою улюблену гру?</p>
          <h2 className="uppercase font-pixel text-7xl">ігрові рецензії</h2>
          <Link href="/reviews" className="bg-zinc-800 w-[50%] hover:bg-zinc-600 text-white py-2 px-4 rounded-full transition">
            Переглянути рецензії
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Main;
