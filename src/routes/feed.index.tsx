import { createFileRoute } from "@tanstack/react-router";
import { PlatformFeed } from "@/components/PlatformFeed";

export const Route = createFileRoute("/feed/")({
  head: () => ({
    meta: [
      { title: "posts | Xylo Mining" },
      { name: "description", content: "Latest posts from Xylo Mining about GoMining and Bitcoin, with views, likes and comments." },
      { property: "og:title", content: "posts | Xylo Mining" },
      { property: "og:description", content: "Latest posts from Xylo Mining about GoMining and Bitcoin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <PlatformFeed />,
});
