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

export interface AnimeInformationType {
  mal_id: number;
  title:string;
  title_english: string;
  type: string;
  images: string;
  aired: string[];
  score: number | null;
  rank: number |null;
  members: number;
  episodes: number | null;
  season: string;
  year: string;
  genres: string[];
  studios:string[];
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

export interface AnimeCharactersType {
  character_name: string;
  character_image: string;
  role:string;
  voice_actor_name: string;
  voice_actor_image:string;
}

export interface AnimeCharactersResponse {
  data: AnimeCharactersType[];
}
