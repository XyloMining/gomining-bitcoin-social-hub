import { createFileRoute } from "@tanstack/react-router";
import { PlatformFeed } from "@/components/PlatformFeed";

export const Route = createFileRoute("/socials/")({
  head: () => ({
    meta: [
      { title: "Socials | Xylo Mining" },
      { name: "description", content: "Latest videos and posts from every Xylo Mining channel: YouTube, TikTok, Instagram, Reddit and X." },
      { property: "og:title", content: "Socials | Xylo Mining" },
      { property: "og:description", content: "Latest posts from Xylo Mining about GoMining and Bitcoin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://xylomining.github.io/socials/" }],
  }),
  component: () => <PlatformFeed />,
});
