import type { AnimeListType } from "../anime-list/anime-list.type";
import type { JikanAnimeListType } from "../jikan-API.type";
import type { AnimeSearchType } from "./anime-search.type";

export function mapJikanAnimeSearch(data: JikanAnimeListType[]) : AnimeListType[] {
  return data.map((anime): AnimeListType => ({
    id: anime.mal_id,
    title: anime.title,
    image: anime.images.webp.image_url,
    score: anime.score,
    episodes: anime.episodes,
    generes: anime.genres.map(g => g.name),
  }));
}
