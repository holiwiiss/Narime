import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import type { AnimeCardType } from "../../services/anime-list/anime-list.type";
import { fetchAnimesSearch } from "./search-results.queries";

export const useSearchAnimes = (query: string) => {
  const { isLoading, isError, data, fetchNextPage, hasNextPage } =
    useInfiniteQuery<
      { animes: AnimeCardType[]; nextPage?: number },
      Error,
      InfiniteData<{ animes: AnimeCardType[]; nextPage?: number }>,
      [string, string],
      number
    >({
      queryKey: ["searchList", query ?? ""],
      queryFn: fetchAnimesSearch,
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: 1,
      enabled: !!query, //si query es null, nunca se ejecuta
    });
    
  return {
    isLoading,
    isError,
    searchList: data?.pages?.flatMap(page => page.animes) || [],
    fetchNextPage,
    hasNextPage
  }
};
