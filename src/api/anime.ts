import { mapJikanAnimeList, mapJikanAnimePagination } from "../mappers/animeMapper";
import type { AnimeResponse, AnimeType, JikanResponse } from "../types/animeListTyping";

const URL__JIKAN= 'https://api.jikan.moe/v4/'

export async function getTopAnime(numPage:number): Promise<AnimeResponse>{

  //JIKAN API está capado por 25 animes por página
  const request = URL__JIKAN + `top/anime?page=${numPage}&sfw=true`;
  console.log(request)

  try {
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

  } catch (error:any) {
    console.error(error.message);
    return {
      animes: [],
      pagination: {
        last_visible_page: 1,
        has_next_page: false,
        current_page: 1
      }
    };
  }
}

export async function getSeasonalAnimes(numPage:Number): Promise<AnimeResponse> {

  const request = URL__JIKAN + `seasons/now?page=${numPage}&sfw=true`;
  console.log(request)

  try {
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

  } catch (error:any) {
    console.error(error.message);
    return {
      animes: [],
      pagination: {
        last_visible_page: 1,
        has_next_page: false,
        current_page: 1
      }
    };
  }
}

export async function getTrendingAnimes(numPage:Number): Promise<AnimeResponse> {
  const request = URL__JIKAN + `top/anime?filter=bypopularity&page=${numPage}&sfw=true`;
  console.log(request)

  try {
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

  } catch (error:any) {
    console.error(error.message);
    return {
      animes: [],
      pagination: {
        last_visible_page: 1,
        has_next_page: false,
        current_page: 1
      }
    };
  }
}

