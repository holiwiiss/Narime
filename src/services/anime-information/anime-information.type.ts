export interface AnimeInformationType {
  id: number;
  title:string;
  titleEnglish: string;
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
  characterName: string;
  characterImage: string;
  role:string;
  voiceActorName: string;
  voiceActorImage:string;
}

