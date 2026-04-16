import type { JikanAnimeGenresType } from "../jikan-API.type";
import type { AnimeGenresType } from "./anime-genres.type";

export function mapJikanAnimeGenres(data: JikanAnimeGenresType[]): AnimeGenresType[]{
  
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

  const dataMapped = data.map((genre): AnimeGenresType => ({
    name: genre.name,
  }))

  return dataMapped.filter((genre) => {
    if(bannedGenres.includes(genre.name)){
      return false
    }else{
      return true
    }
  })
}