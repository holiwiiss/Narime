import type { AnimeInformationType } from "../anime-information/anime-information.type";

export type AnimeRecomendationCardType = Pick <
AnimeInformationType, 
"id" | "title" | "image"> & {
  score?: number;
  episodes?: number;
  type?: string;
  year?: number;
}