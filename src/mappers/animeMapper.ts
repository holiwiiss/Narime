import type { AnimeType,JikanAnimeType } from "../types/animeTyping";

export function mapJikanAnimeList(data: JikanAnimeType[]): AnimeType[] {
  return data.map((anime): AnimeType => ({
    id: anime.mal_id,
    title: anime.title,
    image: anime.images.webp.image_url,
    score: anime.score,
    episodes: anime.episodes,
    generes: anime.genres.map(g => g.name),
  }));
}