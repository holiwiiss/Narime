import type { QueryFunctionContext } from "@tanstack/react-query"
import type { AnimeListResponse } from "../services/anime-list/anime-list.type"
import { getSeasonalAnimes, getTopAnime, getTrendingAnimes } from "../services/anime-list/anime-list"
import type { CategoryType } from "./directory.type"

const functionMap = {
  top: getTopAnime,
  trending: getTrendingAnimes,
  seasonal: getSeasonalAnimes,
}

export const fecthAnimesDirectory = async ({pageParam, queryKey}: QueryFunctionContext<[string, CategoryType], number>) => {
  //['animeList', categoryParam]
  const [, categoryParam] = queryKey
  
  const searchFunction = functionMap[categoryParam]
  const data: AnimeListResponse = await searchFunction(pageParam)

  const currentPage = data.pagination.currentPage
  const nextPage = currentPage >= data.pagination.lastVisiblePage ? undefined : currentPage + 1

  return {
    animes: data.animes,
    nextPage: nextPage,
  }
}