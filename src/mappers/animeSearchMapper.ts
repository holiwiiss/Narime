import type { AnimeSearchType } from "../types/api/animeSearchTyping";
import type { JikanAnimeListType } from "../types/api/JikanAPITyping";

export function mapJikanAnimeSearch(data: JikanAnimeListType[]) : AnimeSearchType[] {
  return data.map((anime): AnimeSearchType => ({
    id: anime.mal_id,
    title: anime.title,
    image: anime.images.webp.image_url,
    type: anime.type,
  }));
}
