export interface AnimeListType {
  id: number;
  title: string;
  image: string;
  score: number | null;
  episodes: number | null;
  generes: string[];
}

export interface PaginationType {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
}

export interface AnimeListResponse {
  animes: AnimeListType[];
  pagination: PaginationType;
}