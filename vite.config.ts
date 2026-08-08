import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so the built assets resolve correctly both locally (served
// at "/") and on GitHub Pages (served under "/bc-dataselfies/") without
// needing separate configs for each. Routing uses HashRouter for the same
// reason — GitHub Pages has no server-side rewrite for client-side routes.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
