import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import type { AnimeCardType } from "../../services/anime-list/anime-list.type";
import type { FiltersType } from "./discover.type";
import { fetchAnimesDiscover } from "./discover.query";

export const useDiscoverAnimes = (filters: FiltersType) =>{
  const {isLoading: isLoadingAnimes, isError:isErrorAnimes, data: discoverList, fetchNextPage, hasNextPage } =
    useInfiniteQuery<
      { animes: AnimeCardType[]; nextPage?: number },
      Error,
      InfiniteData<{ animes: AnimeCardType[]; nextPage?: number }>,
      [string, FiltersType],
      number
    >({
      queryKey: ["discoverList", filters],
      queryFn: fetchAnimesDiscover,
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: 1,
  })
  
  return{
    isLoadingAnimes,
    isErrorAnimes,
    discoverList: discoverList?.pages?.flatMap(page => page.animes) ?? [],
    fetchNextPage,
    hasNextPage
  }

}