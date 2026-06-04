import type { QueryFunctionContext } from "@tanstack/react-query"
import type { AnimeListResponse } from "../../services/anime-list/anime-list.type"
import { discoverAnime } from "../../services/anime-search/anime-search"
import type { FiltersType } from "./discover.type"

export const fetchAnimesDiscover = async ({pageParam, queryKey}: QueryFunctionContext <[string, FiltersType], number>) => {
  const [, filterParam] = queryKey
  const data: AnimeListResponse = await discoverAnime(filterParam.genre?.id ?? null, filterParam.type, filterParam.score,filterParam.sort, filterParam.order, filterParam.status, pageParam)
  const currentPage = data.pagination.currentPage
  const nextPage = currentPage >= data.pagination.lastVisiblePage ? undefined : currentPage + 1

  return {
    animes: data.animes,
    nextPage: nextPage,
  }
}