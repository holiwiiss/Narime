import type { AnimeCardType } from "../anime-list/anime-list.type";
import type { JikanAnimeListType } from "../jikan-API.type";

export function mapJikanAnimeSearch(data: JikanAnimeListType[]) : AnimeCardType[] {
  return data.map((anime): AnimeCardType => ({
    id: anime.mal_id,
    title: anime.title,
    image: anime.images.webp.large_image_url,
    score: anime.score ?? null,
    episodes: anime.episodes ?? 1,
    year: anime.year ?? null,
    type:anime.type
  }));
}
