import type { QueryFunctionContext } from "@tanstack/react-query"
import type { CategoryType, DirectoryCategoryType } from "./directory.type"
import { getSeasonalAnimes, getTopAnime, getTrendingAnimes, getUpcomingAnimes } from "../../services/anime-list/anime-list"
import type { AnimeListResponse } from "../../services/anime-list/anime-list.type"

const functionMap = {
  top: getTopAnime,
  trending: getTrendingAnimes,
  seasonal: getSeasonalAnimes,
  upcoming: getUpcomingAnimes,
}

export const fecthAnimesDirectory = async ({pageParam, queryKey}: QueryFunctionContext<[string, CategoryType], number>) => {
  const [, categoryParam] = queryKey
  
  const searchFunction = functionMap[categoryParam as DirectoryCategoryType]
  if (!searchFunction) return { animes: [], nextPage: undefined }
  const data: AnimeListResponse = await searchFunction(pageParam)

  const currentPage = data.pagination.currentPage
  const nextPage = currentPage >= data.pagination.lastVisiblePage ? undefined : currentPage + 1

  return {
    animes: data.animes,
    nextPage: nextPage,
  }
}