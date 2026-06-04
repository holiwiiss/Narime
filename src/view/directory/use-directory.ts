import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import type { AnimeCardType } from "../../services/anime-list/anime-list.type";
import { fecthAnimesDirectory } from "./directory.queries";
import type { CategoryType } from "./directory.type";

export const useDirectoryAnimes = (category: CategoryType) => {
  const { isLoading, isError, data, fetchNextPage, hasNextPage } =
    useInfiniteQuery<
      { animes: AnimeCardType[]; nextPage?: number }, 
      Error,
      InfiniteData<{ animes: AnimeCardType[]; nextPage?: number }>,
      [string, CategoryType],
      number
    >({
      queryKey: ["animeList", category],
      queryFn: fecthAnimesDirectory,
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: 1,
      enabled: category !== "para ti", 
    });

  return {
    isLoading,
    isError,
    animeList: data?.pages?.flatMap(page => page.animes) || [],
    fetchNextPage,
    hasNextPage,
  }
};
