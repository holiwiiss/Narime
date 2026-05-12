import type { AnimeCardType } from "../anime-list/anime-list.type"
import type { JikanAnimeCharactersType, JikanAnimeInformationType } from "../jikan-API.type"
import type { AnimeCharactersType, AnimeInformationType } from "./anime-information.type"

export function mapJikanAnimeInformation(data: JikanAnimeInformationType): AnimeInformationType {
  return {
    id: data.mal_id,
    title:data.title,
    titleEnglish: data.title_english,
    type: data.type,
    image: data.images.jpg.large_image_url,
    aired: [ data.aired.from ?? data.year, data.aired.to ?? data.year],
    score: data.score ?? null,
    rank: data.rank ?? null,
    members: data.members,
    episodes: data.episodes ?? 1, 
    season: data.season,
    year: data.year ?? null,
    genres: data.genres.map(g => g.name),
    studios: data.studios.map(s => s.name),
    synopsis: data.synopsis,
  }
}

export function mapJikanAnimeCharacters(data: JikanAnimeCharactersType[]): AnimeCharactersType[]{
  return data.map((person): AnimeCharactersType => ({
    characterName: person.character.name,
    characterImage: person.character.images.webp.image_url,
    role: person.role,
    //voice_actors[0] para recoger el japones, que es el que me interesa
    voiceActorName: person.voice_actors[0]?.person.name,
    voiceActorImage: person.voice_actors[0]?.person.images.jpg.image_url,
  }))
}

export function mapJikanAnimeInformationToJikanAnimeList ( data : JikanAnimeInformationType): AnimeCardType {
  return{
    id: data.mal_id,
    title:data.title,
    image: data.images.jpg.large_image_url,
    score: data.score ?? null,
    episodes: data.episodes ?? 1, 
    year: data.year,
    type: data.type,
  }
}