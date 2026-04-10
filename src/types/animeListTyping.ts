export interface JikanResponse {
  data: JikanAnimeType[];
  pagination: JikanPaginationType;
}

export interface AnimeType {
  id: number;
  title: string;
  image: string;
  score: number | null;
  episodes: number | null;
  generes: string[];
}
export interface JikanAnimeType {
  mal_id: number;
  title:string;
  images: {
    webp: {
      image_url: string;
    };
  };
  score: number | null;
  episodes: number | null;
  genres: {
    mal_id: number;
    name: string;
  }[];
}

export interface PaginationType {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
}

export interface JikanPaginationType {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number,
    total: number,
    per_page: number,
  }
}

export interface AnimeResponse {
  animes: AnimeType[];
  pagination: PaginationType;
}