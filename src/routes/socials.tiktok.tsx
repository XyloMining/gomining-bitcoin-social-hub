import { createFileRoute } from "@tanstack/react-router";
import { PlatformFeed } from "@/components/PlatformFeed";

export const Route = createFileRoute("/socials/tiktok")({
  head: () => ({
    meta: [
      { title: "TikTok videos | Xylo Mining" },
      { name: "description", content: "Latest TikTok videos from Xylo Mining about GoMining and Bitcoin, with views, likes and comments." },
      { property: "og:title", content: "TikTok videos | Xylo Mining" },
      { property: "og:description", content: "Latest TikTok videos from Xylo Mining about GoMining and Bitcoin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <PlatformFeed platform="TikTok" />,
});
