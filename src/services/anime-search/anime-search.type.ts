import type { PaginationType } from "../anime-pagination.type";

export interface AnimeSearchType {
    id: number,
    title: string,
    image: string,
    type: string,
    score: number | null,
    episodes: number | null,
}

export interface AnimeSearchResponse {
    animes: AnimeSearchType[];
    pagination: PaginationType;
}