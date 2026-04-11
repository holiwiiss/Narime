import type { JikanAnimeInformationType, AnimeInformationType, JikanAnimeCharactersType, AnimeCharactersType } from "../types/animeInformationTyping";


export function mapJikanAnimeInformation(data: JikanAnimeInformationType): AnimeInformationType {
  return {
    mal_id: data.mal_id,
    title:data.title,
    title_english: data.title_english,
    type: data.type,
    images: data.images.webp.image_url,
    aired: [ data.aired.from, data.aired.to],
    score: data.score,
    rank: data.rank,
    members: data.members,
    episodes: data.episodes, 
    season: data.season,
    year: data.year,
    genres: data.genres.map(g => g.name),
    studios: data.studios.map(s => s.name),
    synopsis: data.synopsis,
  }
}

export function mapJikanAnimeCharacters(data: JikanAnimeCharactersType[]): AnimeCharactersType[]{
  return data.map((person): AnimeCharactersType => ({
    character_name: person.character.name,
    character_image: person.character.images.webp.image_url,
    role: person.role,
    //voice_actors[0] para recoger el japones, que es el que me interesa
    voice_actor_name: person.voice_actors[0]?.person.name,
    voice_actor_image: person.voice_actors[0]?.person.images.jpg.image_url,
  }))
}