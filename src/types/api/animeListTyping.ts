import type { PaginationType } from "./animePaginationTyping";

export interface AnimeListType {
  id: number;
  title: string;
  image: string;
  score: number | null;
  episodes: number | null;
  generes: string[];
}

export interface AnimeListResponse {
  animes: AnimeListType[];
  pagination: PaginationType;
}