import React, { useState } from "react";
import { BookOpen } from "lucide-react";

const API = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL + "/api"
  : "http://localhost:5000/api";

export function Login({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("reader@library.test");
  const [password, setPassword] = useState("reader123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = isSignUp ? "/auth/signup" : "/auth/login";
      const payload = isSignUp ? { name, email, password } : { email, password };

      const res = await fetch(API + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");
      
      if (isSignUp) {
        localStorage.setItem("showReaderGuide", "true");
      }
      onLogin(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] dark:bg-zinc-950 px-4 py-12 transition-colors duration-200">
      <div className="w-full max-w-md bg-[#FDFBF9] dark:bg-zinc-900 border border-[#EFEAE2] dark:border-zinc-800 p-8 shadow-xl rounded-2xl flex flex-col gap-6">
        
        {/* Header section with book icon */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-[#F4EFE6] dark:bg-zinc-800 border border-[#E9E1D2] dark:border-zinc-700 flex items-center justify-center shadow-inner">
            <BookOpen size={20} className="text-zinc-800 dark:text-zinc-200" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h1 className="text-2xl font-serif italic text-zinc-900 dark:text-white">Project Gutenberg</h1>
            <p className="text-[11.5px] font-sans text-zinc-500 dark:text-zinc-400 tracking-wide">
              {isSignUp 
                ? "Create an account to start reading and collaborating."
                : "Sign in to access your library reading rooms."}
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={submit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-4">
            {isSignUp && (
              <div>
                <label className="mb-1.5 block text-[10px] font-sans font-bold uppercase tracking-wider text-zinc-550 dark:text-zinc-400">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alice Liddell"
                  required
                  className="w-full border border-[#E7DFD3] dark:border-zinc-800 bg-[#FAF8F5] dark:bg-zinc-950/50 rounded-xl px-4 py-3 text-[14px] text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-650 focus:border-zinc-400 dark:focus:border-zinc-700 transition-colors focus:outline-none font-sans"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-[10px] font-sans font-bold uppercase tracking-wider text-zinc-555 dark:text-zinc-400">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="reader@library.test"
                required
                className="w-full border border-[#E7DFD3] dark:border-zinc-800 bg-[#FAF8F5] dark:bg-zinc-950/50 rounded-xl px-4 py-3 text-[14px] text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-650 focus:border-zinc-400 dark:focus:border-zinc-700 transition-colors focus:outline-none font-sans"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-sans font-bold uppercase tracking-wider text-zinc-555 dark:text-zinc-400">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-[#E7DFD3] dark:border-zinc-800 bg-[#FAF8F5] dark:bg-zinc-950/50 rounded-xl px-4 py-3 text-[14px] text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-650 focus:border-zinc-400 dark:focus:border-zinc-700 transition-colors focus:outline-none font-sans"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-600 dark:text-red-400 font-sans font-medium text-center">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3 bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-955 font-sans font-semibold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 mt-2 cursor-pointer shadow-sm flex items-center justify-center focus:outline-none"
          >
            {loading ? (isSignUp ? "Creating account…" : "Signing in…") : (isSignUp ? "Create account" : "Sign in")}
          </button>
        </form>

        {/* Toggle section */}
        <p className="text-center text-xs text-zinc-550 dark:text-zinc-400 font-sans -mt-2">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
              if (!isSignUp) {
                setName("");
              }
            }}
            className="text-zinc-900 dark:text-white font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer focus:outline-none"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>

        {/* Demo Credentials Help - Only show on Sign In */}
        {!isSignUp && (
          <div className="text-center text-[11px] font-sans text-zinc-500 dark:text-zinc-400 mt-2 border-t border-[#F2ECE0] dark:border-zinc-800 pt-4 space-y-1">
            <span className="font-bold text-[9px] uppercase tracking-wider text-zinc-400 block mb-1">Demo Credentials</span>
            <p>Reader 1: <code className="bg-[#FAF5EA] dark:bg-zinc-950 px-1 py-0.5 rounded text-zinc-650 dark:text-zinc-350">reader@library.test</code> / <code className="bg-[#FAF5EA] dark:bg-zinc-950 px-1 py-0.5 rounded text-zinc-650 dark:text-zinc-350">reader123</code></p>
            <p>Reader 2: <code className="bg-[#FAF5EA] dark:bg-zinc-950 px-1 py-0.5 rounded text-zinc-650 dark:text-zinc-350">reader2@library.test</code> / <code className="bg-[#FAF5EA] dark:bg-zinc-950 px-1 py-0.5 rounded text-zinc-650 dark:text-zinc-350">reader123</code></p>
          </div>
        )}
      </div>
    </div>
  );
}
