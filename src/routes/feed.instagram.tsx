import { createFileRoute } from "@tanstack/react-router";
import { PlatformFeed } from "@/components/PlatformFeed";

export const Route = createFileRoute("/feed/instagram")({
  head: () => ({
    meta: [
      { title: "Instagram videos | Xylo Mining" },
      { name: "description", content: "Latest Instagram videos from Xylo Mining about GoMining and Bitcoin, with views, likes and comments." },
      { property: "og:title", content: "Instagram videos | Xylo Mining" },
      { property: "og:description", content: "Latest Instagram videos from Xylo Mining about GoMining and Bitcoin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <PlatformFeed platform="Instagram" />,
});
