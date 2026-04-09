import { mapJikanAnimeList } from "../mappers/animeMapper";
import type { AnimeType, JikanResponse } from "../types/animeTyping";

const URL__JIKAN= 'https://api.jikan.moe/v4/'

export async function getTopAnime(numPage:number): Promise<AnimeType[]>{

  //JIKAN API está capado por 25 animes por página
  const request = URL__JIKAN + `top/anime?page=${numPage}&sfw=true`;
  console.log(request)

  try {
    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json: JikanResponse = await response.json()

    if (!json.data) return []
    
    const finalData = mapJikanAnimeList(json.data)
    return finalData

  } catch (error:any) {
    console.error(error.message);
    return [];
  }
}

export async function getSeasonalAnimes(): Promise<AnimeType[]> {

  const request = URL__JIKAN + 'seasons/now?sfw=true';
  console.log(request)

  try {
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json: JikanResponse = await response.json();

    if (!json.data) return [];

    const finalData = mapJikanAnimeList(json.data)
    return finalData;

  } catch (error:any) {
    console.error(error.message);
    return [];
  }
}

export async function getTrendingAnimes() : Promise <AnimeType[]> {
  const request = URL__JIKAN + 'top/anime?filter=bypopularity&page=1&sfw=true';
  console.log(request)

  try {
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json: JikanResponse = await response.json();

    if (!json.data) return [];

    const finalData = mapJikanAnimeList(json.data)
    return finalData;

  } catch (error:any) {
    console.error(error.message);
    return [];
  }
}

