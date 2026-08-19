import { mapJikanAnimePagination } from "../anime-pagination.mapper";
import { jikanApiUrl } from "../apiAxios";
import type { JikanAnimeListType, JikanPaginationType } from "../jikan-API.type";
import { mapJikanAnimeList } from "./anime-list.mapper";
import type { AnimeListResponse } from "./anime-list.type";

/**
 *  Obtiene los animes mejor valorados ordenados de mayor a menor
 *
 * @param numPage - número de página a consultar
 * @returns objeto AnimeListResponse con:
 *  - animes: lista de animes mapeados
 *  - pagination: objeto de información de paginación
 *
 * Ejemplo de respuesta:
 * 
 * objeto = {
 *   animes: [
 *     {id:123, title:'nombre anime', image:'url', score:10, episodes:24, generes:['aventura', 'fantasia']}
 *   ],
 *   pagination: {last_visible_page: 33, has_next_page:true , current_page:24, total_items: 300}
 * 
 * }
 *    
 */

export async function getTopAnime(numPage:number): Promise<AnimeListResponse>{
  const {data} = await jikanApiUrl.get<{ data: JikanAnimeListType[], pagination: JikanPaginationType}>('/top/anime', {
    params:{
      page:numPage,
      sfw:true
    },
  })

  const animes = mapJikanAnimeList(data.data);
  const pagination = mapJikanAnimePagination(data.pagination);
  
  return {
    animes,
    pagination,
  };
}

/**
 *  Obtiene los animes de temporada
 *
 * @param numPage - número de página a consultar
 * @returns objeto AnimeListResponsecon:
 *  - animes: lista de animes mapeados
 *  - pagination: objeto de información de paginación
 *
 * Ejemplo de respuesta:
 * 
 * objeto = {
 *   animes: [
 *     {id:123, title:'nombre anime', image:'url', score:10, episodes:24, generes:['aventura', 'fantasia']}
 *   ],
 *   pagination: {last_visible_page: 33, has_next_page:true , current_page:24}
 * 
 * }
 *    
 */
export async function getSeasonalAnimes(numPage:number): Promise<AnimeListResponse> {
  
  const { data } = await jikanApiUrl.get<{ data: JikanAnimeListType[], pagination: JikanPaginationType}>("/seasons/now", {
    params: {
      page: numPage,
      sfw:true
    },
  });

  return {
    animes: mapJikanAnimeList(data.data),
    pagination: mapJikanAnimePagination(data.pagination),
  };

}

/**
 *  Obtiene los animes más populares ordenados de mayor a menor
 *
 * @param numPage - número de página a consultar
 * @returns objeto AnimeListResponsecon:
 *  - animes: lista de animes mapeados
 *  - pagination: objeto de información de paginación
 *
 * Ejemplo de respuesta:
 * 
 * objeto = {
 *   animes: [
 *     {id:123, title:'nombre anime', image:'url', score:10, episodes:24, generes:['aventura', 'fantasia']}
 *   ],
 *   pagination: {last_visible_page: 33, has_next_page:true , current_page:24}
 * 
 * }
 *    
 */
export async function getTrendingAnimes(numPage:number): Promise<AnimeListResponse> {
  const { data } = await jikanApiUrl.get<{ data: JikanAnimeListType[], pagination: JikanPaginationType}>("/top/anime", {
    params: {
      filter: "bypopularity",
      page: numPage,
      sfw:true
    },
  });

  return {
    animes: mapJikanAnimeList(data.data),
    pagination: mapJikanAnimePagination(data.pagination),
  };
}

export async function getUpcomingAnimes(numPage:number): Promise<AnimeListResponse> {
  const { data } = await jikanApiUrl.get<{ data: JikanAnimeListType[], pagination: JikanPaginationType}>("/seasons/upcoming", {
    params: {
      page: numPage,
      sfw: true,
    },
  });

  return {
    animes: mapJikanAnimeList(data.data),
    pagination: mapJikanAnimePagination(data.pagination),
  };
}

/*
export async function getAnimesFiltered(genre:string, year:number, type:string, numPage:number):Promise<AnimeListResponse> {
  
  const request = URL__JIKAN + `anime?page=${numPage}&${genre}&${year}&${type}&sfw=true`;
  const response = await fetch(request);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  
  const json: JikanResponseAnimeList = await response.json();

  const animes = mapJikanAnimeList(json.data);
  const pagination = mapJikanAnimePagination(json.pagination);

  return{
    animes: animes,
    pagination: pagination
  };
}*/