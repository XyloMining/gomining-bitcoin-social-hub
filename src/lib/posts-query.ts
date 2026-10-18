import { queryOptions } from "@tanstack/react-query";
import { getLatestPosts } from "./feed.functions";

export const postsQuery = queryOptions({
  queryKey: ["posts"],
  queryFn: () => getLatestPosts(),
  staleTime: 5 * 60_000,
});
