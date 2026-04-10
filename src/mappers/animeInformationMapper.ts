import type { JikanAnimeInformationType, AnimeInformationType } from "../types/animeInformationTyping";


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