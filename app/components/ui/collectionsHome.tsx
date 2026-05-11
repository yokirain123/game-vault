import Link from "next/link";
import TiltCard from "./TiltCard";

function collectionsHome() {
  return (
    <main className="px-12">
      <div className="flex flex-row items-center gap-12 px-60">
        <TiltCard/>
        <div className="text-center items-center text-2xl gap-6 flex flex-col">
          <p>Цікаво дізнатись думку про свою улюблену гру?</p>
          <h2 className="uppercase font-pixel text-7xl bg-linear-to-r from-[#5B5BB8] to-[#3FAFF2] bg-clip-text text-transparent">ігрові колекції</h2>
          <Link href="/collections" className="bg-zinc-800 w-[50%] hover:bg-zinc-600 text-white py-2 px-4 rounded-full transition">
            Переглянути колекції
          </Link>
        </div>
      </div>
    </main>
  );
}

export default collectionsHome;
