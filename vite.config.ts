import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
//
// The `/api` proxy exists so the document lab can be exercised locally against
// the real public API. In production there is no proxy: the Cloudflare Worker
// serving alphatensor.com forwards `/api/public/v1/*` to the API host, so the
// browser only ever talks to the site's own origin. See `src/worker.ts`.
const apiProxy = {
  "/api": {
    target: "https://padillaapi.alphatensor.com",
    changeOrigin: true,
    secure: true,
  },
};

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: "0.0.0.0",
    allowedHosts: [".alphatensor.com"],
    proxy: apiProxy,
  },
  preview: {
    port: 3000,
    host: "0.0.0.0",
    proxy: apiProxy,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
