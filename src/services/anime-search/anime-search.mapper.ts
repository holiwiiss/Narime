import type { JikanAnimeListType } from "../jikan-API.type";
import type { AnimeSearchType } from "./anime-search.type";

export function mapJikanAnimeSearch(data: JikanAnimeListType[]) : AnimeSearchType[] {
  return data.map((anime): AnimeSearchType => ({
    id: anime.mal_id,
    title: anime.title,
    image: anime.images.webp.image_url,
    type: anime.type,
    score: anime.score,
    episodes: anime.episodes,
  }));
}
