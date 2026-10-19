# Xylo Mining site (source)

Source for the Xylo Mining website, live at https://xylomining.github.io.
It is a TanStack Start and React project with Tailwind. Pages: home, articles, feed (All, YouTube, TikTok, X) and referrals.

## Development

```sh
bun install   # or npm install
bun run dev
```

## Static build for GitHub Pages

```sh
npx vite build --config vite.pages.config.ts
```

The output is in `dist/client/`. Copy it into the `XyloMining/XyloMining.github.io` repo, keeping that repo's `posts.json`, `articles.json`, `scripts/` and `.github/`.

The static build reads posts from `/posts.json` and articles from `/articles.json`. A scheduled job in the Pages repo refreshes both. `public/articles.json` here is only the starting copy.

## Disclosure

Referral links may earn Xylo Mining a reward at no cost to you. Nothing here is financial advice.
