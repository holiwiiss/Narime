import type { AnimeInformationType } from "../anime-information/anime-information.type";
import type { PaginationType } from "../anime-pagination.type";

export type AnimeCardType = Pick<
AnimeInformationType, 
"id" | "title" | "image" | "score" | "episodes"  | "year" | "type"> 

export interface AnimeListResponse {
  animes: AnimeCardType[];
  pagination: PaginationType;
}