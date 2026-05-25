import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import type { AnimeCardType } from "../services/anime-list/anime-list.type";
import { fecthAnimesDirectory } from "../queries/directory.queries";
import type { CategoryType } from "../queries/directory.type";

export const useDirectoryAnimes = (category: CategoryType) => {
  const { isLoading, isError, data, fetchNextPage, hasNextPage } =
    useInfiniteQuery<
      // Los genericos de React Query son: <TQueryFnData, TError, TData, TQueryKey>
      { animes: AnimeCardType[]; nextPage?: number }, // lo que devuelve queryFn
      Error, // tipo de error
      InfiniteData<{ animes: AnimeCardType[]; nextPage?: number }>, // data transformada (igual)
      [string, CategoryType], // forma del queryKey
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
