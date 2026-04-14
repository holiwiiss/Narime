export interface JikanResponseAnimeList {
  data: JikanAnimeListType[];
  pagination: JikanPaginationType;
}

export interface JikanAnimeListType {
  mal_id: number;
  title:string;
  images: {
    webp: {
      image_url: string;
    };
  };
  score: number | null;
  episodes: number | null;
  type: string;
  genres: {
    mal_id: number;
    name: string;
  }[];
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

export interface JikanResponseAnimeInformation {
  data: JikanAnimeInformationType;
}

export interface JikanAnimeInformationType {
  mal_id: number;
  title:string;
  title_english: string;
  type: string;
  images: {
    webp: {
      image_url: string;
    };
  };
  aired: {
    from:string;
    to:string;
  };
  score: number | null;
  rank: number |null;
  members: number;
  episodes: number | null;
  season: string;
  year: string;
  genres: {
    mal_id: number;
    name: string;
  }[];
  studios: {
    mal_id:number;
    name: string;
  }[];
  synopsis: string;
}

export interface JikanResponseAnimeCharacters {
  data: JikanAnimeCharactersType[];
}

export interface JikanAnimeCharactersType {
  character:{
    name: string;
    images: {
      webp: {
        image_url: string;
      };
    };
  };
  role: string;
  voice_actors:{
    person:{
      name:string;
      images:{
        jpg:{
          image_url: string;
        };
      }
    }
  }[],
}