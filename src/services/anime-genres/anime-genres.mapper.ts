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
    "Crossdressing",
    "CGDCT",
    "Iyashikei",
    "Love Polygon",
    "Pets",
    "Reincarnation",
    "Love Status Quo",
    "Showbiz",
    "Workplace",
    "Urban Fantasy",
    "Martial Arts",
    "Team Sports",
    "Avant Garde",
    "Gourmet",
    "Combat Sports",
    "High Stakes Game",
    "Delinquents",
    "Organized Crime",
    "Super Power",
    "Villainess",
    "Josei", 
    "Kids",
    "Sheinen",
    "Shoujo",
    "Shounen",
  ]

  return dataMapped
    .filter(anime => !bannedGenres.includes(anime.name))
}