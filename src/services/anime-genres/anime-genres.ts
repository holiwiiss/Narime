import type { JikanResponseAnimeGenres } from "../jikan-API.type";
import { mapJikanAnimeGenres } from "./anime-genres.mapper";
import type { AnimeGenresType } from "./anime-genres.type";

const URL__JIKAN= 'https://api.jikan.moe/v4/'

export async function getAnimeGenres(): Promise <AnimeGenresType[]> {
  const request = URL__JIKAN + `genres/anime`;
  const response = await fetch(request);

  if(!response.ok) {
    throw new Error(`Error al llamar a la API: ${response.status}`);
  }

  const json: JikanResponseAnimeGenres = await response.json()

  return mapJikanAnimeGenres(json.data)
}