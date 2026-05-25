import type { JikanAnimeRecomendations } from "../jikan-API.type";
import type { AnimeRecomendationCardType } from "./anime-recommendations.type";


export function mapJikanRecommendationsList ( data: JikanAnimeRecomendations[]): AnimeRecomendationCardType[] {
  return data.map((anime): AnimeRecomendationCardType => ({
    id: anime.entry.mal_id,
    title: anime.entry.title,
    image: anime.entry.images.webp.large_image_url,
  }))
}