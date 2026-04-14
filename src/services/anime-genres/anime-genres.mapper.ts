import type { JikanAnimeGenresType } from "../jikan-API.type";
import type { AnimeGenresType } from "./anime-genres.type";

export function mapJikanAnimeGenres(data: JikanAnimeGenresType[]): AnimeGenresType[]{
  return data.map((genre): AnimeGenresType => ({
    name: genre.name,
  }))
}