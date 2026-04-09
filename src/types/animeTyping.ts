export interface JikanResponse {
  data: JikanAnimeType[];
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
