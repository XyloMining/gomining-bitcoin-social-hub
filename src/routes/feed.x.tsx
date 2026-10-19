import { createFileRoute } from "@tanstack/react-router";
import { XTimeline } from "@/components/XTimeline";

export const Route = createFileRoute("/feed/x")({
  head: () => ({
    meta: [
      { title: "X posts | Xylo Mining" },
      { name: "description", content: "Latest X posts from Xylo Mining about GoMining and Bitcoin, with views, likes and comments." },
      { property: "og:title", content: "X posts | Xylo Mining" },
      { property: "og:description", content: "Latest X posts from Xylo Mining about GoMining and Bitcoin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <XTimeline />,
});
