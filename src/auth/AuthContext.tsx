import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * Auth — DEMO PROP ONLY. This secures NOTHING.
 * ---------------------------------------------------------------------------
 * This is a static, backend-free pitch mockup. There is no auth server, no
 * token, no session — nothing is verified. The app boots ALREADY "signed in"
 * as the Monte Fenosu owner so the demo opens straight into /dashboard with no
 * login wall.
 *
 * A credible /login screen still exists (reachable from the account menu and by
 * URL) purely so the pitch can say "there's proper auth — I'm skipping it for
 * the demo." Submitting that form just flips this in-memory flag; it never
 * checks a credential. "Logout" flips it back and is equally cosmetic.
 */

/** The single hardcoded demo user — the winery owner. */
export interface DemoUser {
  name: string;
  role: string; // Italian role label shown in the account menu
  estate: string;
  initials: string;
}

const DEMO_USER: DemoUser = {
  name: "Piras",
  role: "Titolare",
  estate: "Monte Fenosu",
  initials: "MF",
};

interface AuthState {
  /** Always starts true (auto-login). Cosmetic only. */
  isAuthenticated: boolean;
  user: DemoUser;
  /** Cosmetic "sign in" — used by the /login prop. Verifies nothing. */
  signIn: () => void;
  /** Cosmetic "sign out" — used by the account menu. */
  signOut: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // AUTO-LOGIN: default to authenticated so the app never shows a login wall.
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const value = useMemo<AuthState>(
    () => ({
      isAuthenticated,
      user: DEMO_USER,
      signIn: () => setIsAuthenticated(true),
      signOut: () => setIsAuthenticated(false),
    }),
    [isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Access the demo auth state. Throws if used outside the provider. */
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
