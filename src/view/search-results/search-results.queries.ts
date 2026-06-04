import type { QueryFunctionContext } from "@tanstack/react-query";
import type { AnimeListResponse } from "../../services/anime-list/anime-list.type";
import { searchAnime } from "../../services/anime-search/anime-search";


export const fetchAnimesSearch = async ({pageParam, queryKey}: QueryFunctionContext<[string, string], number>) => {

  const [, searchParam] = queryKey
  if(!searchParam) throw new Error("No search param");

  const data: AnimeListResponse = await searchAnime(searchParam, pageParam, 25)

  const currentPage = data.pagination.currentPage
  const nextPage = currentPage >= data.pagination.lastVisiblePage ? undefined : currentPage + 1

  return {
    animes: data.animes,
    nextPage: nextPage,
  }
}
