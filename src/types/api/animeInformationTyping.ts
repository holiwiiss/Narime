export interface AnimeInformationType {
  id: number;
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

export interface AnimeCharactersType {
  character_name: string;
  character_image: string;
  role:string;
  voice_actor_name: string;
  voice_actor_image:string;
}

