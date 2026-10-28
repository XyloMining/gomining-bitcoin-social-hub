import { createFileRoute } from "@tanstack/react-router";
import { PlatformFeed } from "@/components/PlatformFeed";

export const Route = createFileRoute("/socials/reddit")({
  head: () => ({
    meta: [
      { title: "Reddit posts | Xylo Mining" },
      { name: "description", content: "Latest Reddit posts from Xylo Mining about GoMining and Bitcoin, with views, likes and comments." },
      { property: "og:title", content: "Reddit posts | Xylo Mining" },
      { property: "og:description", content: "Latest Reddit posts from Xylo Mining about GoMining and Bitcoin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <PlatformFeed platform="Reddit" />,
});
