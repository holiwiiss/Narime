import type { JikanAnimeGenresType } from "../jikan-API.type";
import type { AnimeGenreType } from "./anime-genre.type";

export function mapJikanAnimeGenres(data: JikanAnimeGenresType[]): AnimeGenreType[]{
  const dataMapped = data.map((genre):AnimeGenreType => ({
    id:genre.mal_id,
    name: genre.name,
  }))
  const bannedGenres = [
    "Hentai",
    "Erotica",
    "Ecchi",
    "Harem",
    "Reverse Harem",
    "Magical Sex Shift",
    "Boys Love",
    "Girls Love",
    "Gore",
    "Adult Cast",
    "Crossdressing"
  ]

  return dataMapped
    .filter(anime => !bannedGenres.includes(anime.name))
}