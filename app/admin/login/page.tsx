"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../data/supabaseClient";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    setUserEmail(null);
    setEmail("");
    setPassword("");

    router.refresh();
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-900 px-6 text-white">
        <p className="text-white/50">Loading...</p>
      </main>
    );
  }

  if (userEmail) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-900 px-6 text-white">
        <div className="w-full max-w-md rounded-3xl bg-zinc-800 p-8">
          <h1 className="mb-3 text-3xl font-bold">Admin panel</h1>

          <p className="mb-6 text-sm text-white/50">
            You are logged in as <span className="text-white">{userEmail}</span>
          </p>

          <div className="grid gap-3">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full rounded-xl bg-[#59B292] px-4 py-3 font-bold text-white transition hover:bg-[#73d3b2]"
            >
              Go to site
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-xl bg-red-500 px-4 py-3 font-bold text-white transition hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-900 px-6 text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-3xl bg-zinc-800 p-8"
      >
        <h1 className="mb-6 text-3xl font-bold">Admin login</h1>

        <input
          type="email"
          placeholder="Email"
          className="mb-4 w-full rounded-xl bg-zinc-900 px-4 py-3 outline-none ring-1 ring-zinc-700 focus:ring-[#59B292]"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-6 w-full rounded-xl bg-zinc-900 px-4 py-3 outline-none ring-1 ring-zinc-700 focus:ring-[#59B292]"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-[#59B292] px-4 py-3 font-bold text-zinc-900 transition hover:bg-[#73d3b2]"
        >
          Login
        </button>
      </form>
    </main>
  );
}
