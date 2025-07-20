import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Spinner from "./Spinner";

function AuthScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for the login link!");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white dark:bg-slate-900 dark:text-white p-4">
      <div className="bg-slate-900 dark:bg-slate-800 p-8 rounded-xl shadow-xl w-full max-w-md text-center animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">Sign in to Transit Trivia</h1>
        <input
          className="w-full px-4 py-2 mb-4 rounded bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand dark:bg-slate-700"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleLogin}
          disabled={loading || !email}
          className="w-full bg-brand hover:bg-brand-light text-white py-2 rounded transition disabled:opacity-50"
        >
          {loading ? <Spinner size="sm" /> : "Send Magic Link"}
        </button>
        {message && <p className="mt-4 text-sm text-gray-300 dark:text-gray-400">{message}</p>}
      </div>
    </div>
  );
}

export default AuthScreen;
