import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Wordmark } from "@/components/Wordmark";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/auth/AuthContext";

/**
 * Login — CREDIBLE PROP ONLY. It secures NOTHING.
 * ---------------------------------------------------------------------------
 * The app auto-logs-in and opens on /dashboard, so this screen is never a wall.
 * It exists so the pitch can show "there's proper auth — I'm skipping it."
 *
 * Submitting the form OR clicking "Entra nella demo" does the same thing: flip
 * the cosmetic auth flag and navigate to /dashboard. No credential is ever
 * checked; the inputs are decorative. Reachable at /login and from the account
 * menu.
 */
export function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  // Prefilled decorative values so the form looks "already set up" for the demo.
  const [email, setEmail] = useState("titolare@montefenosu.it");
  const [password, setPassword] = useState("demo1234");

  // Any submission drops straight into the app. Verifies nothing.
  function enterApp(e?: FormEvent) {
    e?.preventDefault();
    signIn();
    navigate("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-s5">
      <div className="w-full max-w-[380px]">
        {/* Brand */}
        <div className="mb-s7 flex flex-col items-center text-center">
          <Wordmark className="h-8 w-auto" />
          <p className="mt-s3 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-3">
            Cantina
          </p>
        </div>

        <form
          onSubmit={enterApp}
          className="rounded-card border border-border bg-bg p-s6 shadow-sm"
        >
          <h1 className="font-display text-[22px] font-bold text-ink font-display-tight">
            Accedi
          </h1>
          <p className="mt-s2 text-[14px] leading-relaxed text-ink-2">
            Area riservata Monte Fenosu.
          </p>

          {/* Email */}
          <label className="mt-s5 block text-[13px] font-semibold text-ink" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-s2 min-h-[44px] w-full rounded-input border border-border-2 bg-bg px-s3 text-[14px] text-ink transition-[border-color,box-shadow] focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent-weak"
          />

          {/* Password */}
          <label
            className="mt-s4 block text-[13px] font-semibold text-ink"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-s2 min-h-[44px] w-full rounded-input border border-border-2 bg-bg px-s3 text-[14px] text-ink transition-[border-color,box-shadow] focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent-weak"
          />

          {/* Primary submit — the single accent action on this view. */}
          <Button type="submit" variant="primary" className="mt-s6 w-full">
            Accedi
          </Button>

          {/* Explicit shortcut for the pitch. */}
          <Button
            type="button"
            variant="ghost"
            className="mt-s2 w-full"
            onClick={() => enterApp()}
          >
            Entra nella demo
          </Button>
        </form>

        <p className="mt-s5 text-center text-[12px] tracking-[0.14em] text-ink-3">
          ARBISU
        </p>
      </div>
    </div>
  );
}
