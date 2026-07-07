import React, { useState } from "react";
import { Library } from "lucide-react";

const API = "http://localhost:5000/api";

export function Login({ onLogin }) {
  const [email, setEmail] = useState("reader@library.test");
  const [password, setPassword] = useState("reader123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(API + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      onLogin(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 p-8 shadow-[8px_8px_0px_#000] dark:shadow-[8px_8px_0px_#fff] rounded-none flex flex-col gap-6">
        <div className="flex items-center gap-3 justify-center mb-2">
          <div className="w-8 h-8 rounded-none border border-zinc-300 dark:border-zinc-700 bg-zinc-950 dark:bg-zinc-50 flex items-center justify-center">
            <Library size={16} className="text-white dark:text-zinc-950" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white uppercase">Library</h1>
        </div>

        <form onSubmit={submit}>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="reader@library.test"
                required
                className="w-full border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-none px-4 py-3 text-[15px] text-zinc-950 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-650 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-none px-4 py-3 text-[15px] text-zinc-950 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-650 focus:outline-none"
              />
            </div>
          </div>
          {error && <p className="mt-4 text-xs text-red-600 dark:text-red-400 font-medium text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg py-3 bg-zinc-950 dark:bg-zinc-50 border-2 border-zinc-950 dark:border-zinc-50 text-white dark:text-zinc-950 font-bold text-sm uppercase tracking-wider hover:bg-white hover:text-zinc-950 dark:hover:bg-zinc-950 dark:hover:text-white transition-all hover:shadow-[4px_4px_0px_#000] dark:hover:shadow-[4px_4px_0px_#fff] disabled:opacity-50 mt-6 cursor-pointer"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-2 border-t-2 border-zinc-300 dark:border-zinc-700 pt-4 space-y-1">
          <p>Reader 1: reader@library.test / reader123</p>
          <p>Reader 2: reader2@library.test / reader123</p>
        </div>
      </div>
    </div>
  );
}
