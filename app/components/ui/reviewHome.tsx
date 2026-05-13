import Link from "next/link";
import TiltCard from "./TiltCard";
import reviewsImage from "../images/reviews.png";
import { FaArrowRight } from "react-icons/fa6";

function reviewHome() {
  return (
    <main>
      <div className="flex flex-row items-center gap-12 px-60">
        <div>
          <TiltCard image={reviewsImage.src} title="reviews" />
        </div>

        <div className="text-center items-center text-2xl gap-6 flex flex-col">
          <p>Цікаво дізнатись думку про свою улюблену гру?</p>
          <h2 className="uppercase font-pixel text-7xl bg-linear-to-bl from-[#23A088] to-[#9de48d] bg-clip-text text-transparent">
            ігрові рецензії
          </h2>
          <Link
            href="/reviews"
            className="flex items-center gap-2 bg-bg-alt/75 hover:bg-zinc-700/50 transition-all uppercase duration-500 text-sm py-2 px-4 text-main rounded-xl"
          >
            Переглянути рецензії <FaArrowRight size={15} />
          </Link>
        </div>
      </div>
    </main>
  );
}

export default reviewHome;
