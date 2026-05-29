import { jikanApiUrl } from "../apiAxios";
import type { JikanAnimeGenresType } from "../jikan-API.type";
import type { AnimeGenreType } from "./anime-genre.type";
import { mapJikanAnimeGenres } from "./anime-genres.mapper";

export async function getAnimeGenres():Promise <AnimeGenreType[]> {
  const {data} = await jikanApiUrl.get<{data: JikanAnimeGenresType[]}>(`genres/anime`)
  return mapJikanAnimeGenres(data.data)
} 