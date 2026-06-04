import type { AnimeGenreType } from "../../services/anime-genres/anime-genre.type"

export type FiltersType = {
  genre: AnimeGenreType | null, 
  type:string | null,
  score: number | null, 
  sort: string | null
  order:string | null, 
  status: string | null, 
}

export const TYPE_LIST = ["TV", "OVA", "Movie", "Special", "ONA"]
export const STATUS_LIST = ["airing", "complete", "upcoming"]
export const SCORE_LIST = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
export const SORT_LIST = ["asc", "desc"]