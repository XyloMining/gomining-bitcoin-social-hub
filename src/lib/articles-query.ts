import { queryOptions } from "@tanstack/react-query";

export type Article = {
  title: string;
  url: string;
  thumbnail?: string;
  date: string;
  subtitle?: string;
};

/** The article shown first, as the recommended read. */
export const FEATURED_URL =
  "https://xylomining.medium.com/my-gomining-results-14-miners-145-aud-last-month-and-what-id-do-differently-62092accb9d1";

/** Used until /articles.json (refreshed from the Medium feed) is available. */
export const seedArticles: Article[] = [
  {
    title: "My GoMining Results: 14 Miners, $145 AUD Last Month, and What I’d Do Differently",
    subtitle: "An honest review from an everyday Australian investor",
    url: FEATURED_URL,
    thumbnail: "https://miro.medium.com/v2/resize:fit:1200/1*prkFoiGcrnFPuM-eaPhlDQ.jpeg",
    date: "2026-05-23T06:19:21.000Z",
  },
  {
    title: "GoMining VIP Levels Explained: How to Get Better Rates as Your Farm Grows",
    url: "https://xylomining.medium.com/gomining-vip-levels-explained-how-to-get-better-rates-as-your-farm-grows-031346f775ff",
    thumbnail: "https://cdn-images-1.medium.com/max/1024/1*p_FwZkNFwhiOWGL8ur8Fkw.png",
    date: "2026-05-25T21:01:00.000Z",
  },
  {
    title: "I’m Mining Crypto While My GPU Does AI Work at the Same Time: Here’s How",
    url: "https://xylomining.medium.com/im-mining-crypto-while-my-gpu-does-ai-work-at-the-same-time-here-s-how-bdca68f54be9",
    thumbnail: "https://cdn-images-1.medium.com/max/500/1*-4HoqEqNteGdiqdImXaxTg.avif",
    date: "2026-06-15T21:01:00.000Z",
  },
];

export const articlesQuery = queryOptions({
  queryKey: ["articles"],
  queryFn: async (): Promise<Article[]> => {
    try {
      const res = await fetch("/articles.json", { cache: "no-cache" });
      if (!res.ok) return seedArticles;
      const data = (await res.json()) as Article[];
      return Array.isArray(data) && data.length ? data : seedArticles;
    } catch {
      return seedArticles;
    }
  },
  staleTime: 5 * 60_000,
});

/** Featured article first, then the rest newest first. */
export function orderArticles(list: Article[]): { featured: Article; rest: Article[] } {
  const featured =
    list.find((a) => a.url.split("?")[0] === FEATURED_URL) ??
    seedArticles.find((a) => a.url === FEATURED_URL)!;
  const rest = list
    .filter((a) => a.url.split("?")[0] !== FEATURED_URL)
    .sort((a, b) => b.date.localeCompare(a.date));
  return { featured, rest };
}
