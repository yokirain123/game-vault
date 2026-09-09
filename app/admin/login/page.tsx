"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../data/supabaseClient";
import { focusFormControl } from "../../data/formValidation";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserEmail(user?.email ?? null);
      setIsLoading(false);
    }

    checkUser();
  }, [supabase]);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage("Введіть email.");
      focusFormControl(event.currentTarget, "email");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMessage("Введіть коректний email.");
      focusFormControl(event.currentTarget, "email");
      return;
    }

    if (!password) {
      setErrorMessage("Введіть пароль.");
      focusFormControl(event.currentTarget, "password");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function handleLogout() {
    setErrorMessage(null);
    setIsSubmitting(true);
    const { error } = await supabase.auth.signOut();
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setUserEmail(null);
    setEmail("");
    setPassword("");

    router.refresh();
  }

  if (isLoading) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-zinc-900 px-4 py-10 text-white sm:px-6">
        <p className="text-white/50">Завантажую...</p>
      </main>
    );
  }

  if (userEmail) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-zinc-900 px-4 py-10 text-white sm:px-6">
        <div className="w-full max-w-md rounded-3xl bg-zinc-800 p-5 sm:p-8">
          <h1 className="mb-3 text-2xl font-bold sm:text-3xl">Адмін-панель</h1>

          <p className="mb-6 break-words text-sm text-white/60">
            Ви увійшли як <span className="text-white">{userEmail}</span>
          </p>

          {errorMessage && (
            <p role="alert" className="mb-4 rounded-xl bg-red-500/15 p-3 text-sm text-red-200">
              {errorMessage}
            </p>
          )}

          <div className="grid gap-3">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="min-h-12 w-full rounded-xl bg-[#59B292] px-4 py-3 font-bold text-zinc-950 transition hover:bg-[#73d3b2]"
            >
              Перейти на сайт
            </button>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isSubmitting}
              className="min-h-12 w-full rounded-xl bg-red-500 px-4 py-3 font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Виходжу..." : "Вийти"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-zinc-900 px-4 py-10 text-white sm:px-6">
      <form
        onSubmit={handleLogin}
        noValidate
        aria-busy={isSubmitting}
        className="w-full max-w-md rounded-3xl bg-zinc-800 p-5 sm:p-8"
      >
        <p className="mb-2 text-sm uppercase tracking-widest text-[#59B292]">Game Vault</p>
        <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Вхід для адміністратора</h1>

        {errorMessage && (
          <p role="alert" className="mb-4 rounded-xl bg-red-500/15 p-3 text-sm text-red-200">
            {errorMessage}
          </p>
        )}

        <label className="mb-4 grid gap-2 text-sm font-bold text-zinc-200">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            className="min-h-12 w-full rounded-xl bg-zinc-900 px-4 py-3 text-base outline-none ring-1 ring-zinc-700 focus:ring-2 focus:ring-[#59B292]"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="mb-6 grid gap-2 text-sm font-bold text-zinc-200">
          Пароль
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Ваш пароль"
            className="min-h-12 w-full rounded-xl bg-zinc-900 px-4 py-3 text-base outline-none ring-1 ring-zinc-700 focus:ring-2 focus:ring-[#59B292]"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-12 w-full rounded-xl bg-[#59B292] px-4 py-3 font-bold text-zinc-950 transition hover:bg-[#73d3b2] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Входжу..." : "Увійти"}
        </button>

        <Link
          href="/"
          className="mt-4 flex min-h-11 items-center justify-center rounded-xl text-sm text-white/60 transition-colors hover:text-white"
        >
          Повернутися на сайт
        </Link>
      </form>
    </main>
  );
}
