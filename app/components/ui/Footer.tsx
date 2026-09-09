import Link from "next/link";
import {
  FaDiscord,
  FaGithub,
  FaSpotify,
  FaTelegram,
  FaYoutube,
} from "react-icons/fa";
import Logo from "../images/gamepad.svg";
import Divider from "./Divider";

const socialLinks = [
  { href: "https://t.me/yokiqqq", label: "Telegram", Icon: FaTelegram },
  { href: "https://github.com/yokirain123", label: "GitHub", Icon: FaGithub },
  { href: "https://discord.gg/RdqVwYdjXa", label: "Discord", Icon: FaDiscord },
  {
    href: "https://www.youtube.com/@pixel_marshal",
    label: "YouTube",
    Icon: FaYoutube,
  },
  {
    href: "https://open.spotify.com/user/u1nh9w1xtc32ma7xijptcfgaw?si=4222f43f64084eec",
    label: "Spotify",
    Icon: FaSpotify,
  },
];

function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800/25 bg-background py-8 text-main dark:border-zinc-400/20 sm:py-10">
      <div className="page-container">
        <div className="grid gap-10 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-[1fr_auto_1fr] lg:items-start">
          <Link
            href="/"
            aria-label="Game Vault — головна"
            className="mx-auto flex w-fit flex-col items-center gap-2 font-pixel text-xs uppercase text-main transition-colors hover:text-accent sm:mx-0"
          >
            <Logo aria-hidden="true" className="h-14 w-14 text-accent" />
            Game Vault
          </Link>

          <nav
            aria-label="Навігація у підвалі"
            className="flex flex-col items-center gap-3 uppercase sm:items-start"
          >
            <h2 className="text-lg font-black text-accent">Навігація</h2>
            <Link
              href="/reviews"
              className="min-h-8 transition-colors hover:text-accent"
            >
              Рецензії
            </Link>
            <Link
              href="/collections"
              className="min-h-8 transition-colors hover:text-accent"
            >
              Добірки
            </Link>
            <Link
              href="/backlog"
              className="min-h-8 transition-colors hover:text-accent"
            >
              Беклог
            </Link>
          </nav>

          <div className="sm:col-span-2 lg:col-span-1 lg:justify-self-end">
            <h2 className="text-lg font-black uppercase text-accent">
              work in progress
            </h2>
            <p className="mt-3 max-w-sm text-sm text-main/60">
              Персональний журнал про ігри, враження та плани на проходження.
            </p>
          </div>
        </div>

        <Divider />

        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          {socialLinks.map(({ href, label, Icon }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-bg-alt/50 hover:text-accent"
            >
              <Icon aria-hidden="true" size={25} />
            </Link>
          ))}
        </div>

        <p className="mt-4 text-center text-sm text-main/60">
          &copy; 2026 Game Vault. Всі права захищені.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
