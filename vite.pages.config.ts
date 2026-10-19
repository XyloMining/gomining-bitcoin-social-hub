import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const here = path.dirname(fileURLToPath(import.meta.url));

// Static build for GitHub Pages. The Lovable build (vite.config.ts) is left untouched.
// Swaps the server-function posts query for a posts.json fetch and prerenders every page.
export default defineConfig({
  nitro: false,
  tanstackStart: {
    prerender: { enabled: true, crawlLinks: true },
  },
  vite: {
    resolve: {
      alias: [
        {
          find: /^@\/lib\/posts-query$/,
          replacement: path.resolve(here, "src/lib/posts-query.static.ts"),
        },
        {
          find: /^.*lovable-error-reporting$/,
          replacement: path.resolve(here, "src/lib/error-reporting.static.ts"),
        },
      ],
    },
  },
});
