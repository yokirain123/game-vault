import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import reviewsImage from "../images/collections.png";
import TiltCard from "./TiltCard";

function CollectionsHome() {
  return (
    <section aria-labelledby="collections-home-title" className="page-container">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <TiltCard image={reviewsImage} title="Ігрові добірки" />

        <div className="flex min-w-0 flex-col items-center gap-5 text-center lg:gap-6">
          <p className="text-lg text-main/75 sm:text-2xl">
            Шукаєш щось під настрій?
          </p>
          <h2
            id="collections-home-title"
            className="break-words bg-linear-to-r from-[#5B5BB8] to-[#3FAFF2] bg-clip-text font-pixel text-[clamp(2rem,6vw,4.5rem)] uppercase leading-tight text-transparent"
          >
            ігрові добірки
          </h2>
          <Link
            href="/collections"
            className="flex min-h-11 items-center gap-2 rounded-xl bg-bg-alt/75 px-4 py-2 text-sm uppercase text-main transition-colors hover:bg-bg-alt hover:text-accent"
          >
            Переглянути добірки <FaArrowRight aria-hidden="true" size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CollectionsHome;
