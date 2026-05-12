export interface AnimeInformationType {
  id: number;
  title:string;
  titleEnglish: string;
  type: string;
  image: string;
  aired: string[];
  score: number | null;
  rank: number |null;
  members: number;
  episodes: number;
  season: string;
  year: number | null;
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

