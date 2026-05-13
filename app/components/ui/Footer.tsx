import React from "react";
import Logo from "../images/gamepad.svg";
import Divider from "./Divider";
import {
  FaTelegram,
  FaGithub,
  FaDiscord,
  FaYoutube,
  FaSpotify,
} from "react-icons/fa";
import Link from "next/link";

function Footer() {
  return (
    <div>
      <footer className="bg-background border-t border-zinc-800/25 text-main px-20 py-6 text-center">
        <div className="flex justify-between items-start px-40">
          <div className="flex flex-col font-pixel text-sm items-center uppercase">
            <Logo className="w-15 h-15 text-accent" />
            Game Vault
          </div>
          <div className="flex flex-col gap-4 items-start uppercase">
            <h3 className="font-black uppercase text-lg text-accent">
              Навігація
            </h3>
            <Link
              href="/reviews"
              className="text-md hover:text-accent transition-all duration-500"
            >
              Рецензії
            </Link>
            <Link
              href="/collections"
              className="text-md hover:text-accent transition-all duration-500"
            >
              Добірки
            </Link>
            <Link
              href="/backlog"
              className="text-md hover:text-accent transition-all duration-500"
            >
              Беклог
            </Link>
          </div>
          <div>
            <h3 className="font-black uppercase text-lg text-accent">
              work in progress
            </h3>
          </div>
        </div>
        <Divider />
        <div className="flex flex-row gap-10 p-4 justify-center">
          <Link href="https://t.me/yokiqqq">
            <FaTelegram
              size={30}
              className="hover:text-accent transition-all duration-500"
            />
          </Link>
          <Link href="https://github.com/yokirain123">
            <FaGithub
              size={30}
              className="hover:text-accent transition-all duration-500"
            />
          </Link>
          <Link href="https://discord.gg/RdqVwYdjXa">
            <FaDiscord
              size={30}
              className="hover:text-accent transition-all duration-500"
            />
          </Link>
          <Link href="https://www.youtube.com/@pixel_marshal">
            <FaYoutube
              size={30}
              className="hover:text-accent transition-all duration-500"
            />
          </Link>
          <Link href="https://open.spotify.com/user/u1nh9w1xtc32ma7xijptcfgaw?si=4222f43f64084eec">
            <FaSpotify
              size={30}
              className="hover:text-accent transition-all duration-500"
            />
          </Link>
        </div>
        <p className="text-sm text-main mt-4">
          &copy; 2026 Game Vault. Всі права захищені.
        </p>
      </footer>
    </div>
  );
}

export default Footer;
