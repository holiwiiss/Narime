import type { PaginationType } from "./animePaginationTyping";

export interface AnimeSearchType {
    id: number,
    title: string,
    image: string,
    type: string,
}

export interface AnimeSearchResponse {
    animes: AnimeSearchType[];
    pagination: PaginationType;
}