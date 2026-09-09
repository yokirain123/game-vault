import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import reviewsImage from "../images/reviews.png";
import TiltCard from "./TiltCard";

function ReviewHome() {
  return (
    <section aria-labelledby="reviews-home-title" className="page-container">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <TiltCard image={reviewsImage} title="Ігрові рецензії" />

        <div className="flex min-w-0 flex-col items-center gap-5 text-center lg:gap-6">
          <p className="text-lg text-main/75 sm:text-2xl">
            Цікаво дізнатись думку про свою улюблену гру?
          </p>
          <h2
            id="reviews-home-title"
            className="break-words bg-linear-to-bl from-[#23A088] to-[#9de48d] bg-clip-text font-pixel text-[clamp(2rem,6vw,4.5rem)] uppercase leading-tight text-transparent"
          >
            ігрові рецензії
          </h2>
          <Link
            href="/reviews"
            className="flex min-h-11 items-center gap-2 rounded-xl bg-bg-alt/75 px-4 py-2 text-sm uppercase text-main transition-colors hover:bg-bg-alt hover:text-accent"
          >
            Переглянути рецензії <FaArrowRight aria-hidden="true" size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ReviewHome;
