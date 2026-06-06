import { useQuery } from "@tanstack/react-query"
import type { AnimeListResponse } from "../services/anime-list/anime-list.type"
import { searchAnime } from "../services/anime-search/anime-search"

export const useAnimeSearch = (query: string) => {
  const { isLoading, isError, data } = useQuery<AnimeListResponse>({
    queryKey: ["animeSearch", query],
    queryFn: ({ signal }) => searchAnime(encodeURIComponent(query), 1, 5, signal),
    enabled: query.length > 0,
    staleTime: 1000 * 60,
  })

  return {
    isLoading,
    isError,
    searchList: data?.animes ?? [],
    totalItems: data?.pagination.totalItems ?? 0,
  }
}