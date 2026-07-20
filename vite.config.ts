import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// Vite config — plain static SPA build.
// No proxy, no server middleware: this app makes zero network calls at runtime.
// `npm run build` emits to `dist/` (the Cloudflare Pages output directory).
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // `@/` -> `src/` (mirrors the tsconfig path alias so imports match at build time).
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
