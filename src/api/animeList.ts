import { mapJikanAnimeList, mapJikanAnimePagination } from "../mappers/animeListMapper";
import type { AnimeResponse, JikanResponse } from "../types/animeListTyping";

const URL__JIKAN= 'https://api.jikan.moe/v4/'

//JIKAN API está capado por 25 animes por página
export async function getTopAnime(numPage:number): Promise<AnimeResponse>{
  const request = URL__JIKAN + `top/anime?page=${numPage}&sfw=true`;
  const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`Error al llamar a la API: ${response.status}`);
    }

    const json: JikanResponse = await response.json();

    const animes = mapJikanAnimeList(json.data);
    const pagination = mapJikanAnimePagination(json.pagination);

  return{
    animes: animes,
    pagination: pagination
  };
}

export async function getSeasonalAnimes(numPage:Number): Promise<AnimeResponse> {
  const request = URL__JIKAN + `seasons/now?page=${numPage}&sfw=true`;
  const response = await fetch(request);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json: JikanResponse = await response.json();

  const animes = mapJikanAnimeList(json.data);
  const pagination = mapJikanAnimePagination(json.pagination);

  return{
    animes: animes,
    pagination: pagination
  };
}

export async function getTrendingAnimes(numPage:Number): Promise<AnimeResponse> {
  const request = URL__JIKAN + `top/anime?filter=bypopularity&page=${numPage}&sfw=true`;
  const response = await fetch(request);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  
  const json: JikanResponse = await response.json();

  const animes = mapJikanAnimeList(json.data);
  const pagination = mapJikanAnimePagination(json.pagination);

  return{
    animes: animes,
    pagination: pagination
  };
}