import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    trailingSlash: "always", // links match the canonical and sitemap URLs, so crawlers never hit a redirect
    defaultPreloadStaleTime: 0,
  });

  return router;
};
