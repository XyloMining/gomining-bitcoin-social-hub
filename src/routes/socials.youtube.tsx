import { createFileRoute } from "@tanstack/react-router";
import { PlatformFeed } from "@/components/PlatformFeed";

export const Route = createFileRoute("/socials/youtube")({
  head: () => ({
    meta: [
      { title: "YouTube videos | Xylo Mining" },
      { name: "description", content: "Latest YouTube videos from Xylo Mining about GoMining and Bitcoin, with views, likes and comments." },
      { property: "og:title", content: "YouTube videos | Xylo Mining" },
      { property: "og:description", content: "Latest YouTube videos from Xylo Mining about GoMining and Bitcoin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <PlatformFeed platform="YouTube" />,
});
