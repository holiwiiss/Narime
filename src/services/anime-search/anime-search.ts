import type { AnimeListResponse } from "../anime-list/anime-list.type";
import { mapJikanAnimePagination } from "../anime-pagination.mapper";
import { jikanApiUrl } from "../apiAxios";
import type { JikanAnimeListType, JikanPaginationType } from "../jikan-API.type";
import { mapJikanAnimeSearch } from "./anime-search.mapper";

/**
 *  Busca animes por nombre usando Jikan API
 *
 * @param animeName - texto de búsqueda
 * @returns objeto AnimeSearcgResponse con:
 *  - animes: lista de animes mapeados
 *  - pagination: objeto de información de paginación
 * 
 * Ejemplo de respuesta:
 * 
 * objeto = {
 *   animes: [
 *     {id: 123, title: 'ejemplo', image: 'url', type: 'TV'},
 *   ],
 *   pagination: {last_visible_page: 33, has_next_page:true , current_page:24, total_items: 300}
 * }
 * 
 */

export async function searchAnime(animeName:string, page:number, animeLimit: number): Promise<AnimeListResponse> {
  
  const {data} = await jikanApiUrl.get<{ data: JikanAnimeListType[], pagination: JikanPaginationType}>('/anime', {
    params:{
      q:animeName,
      page: page,
      order_by: "popularity",
      limit: animeLimit,
      sfw: true,
    }
  })

  return{
    animes: mapJikanAnimeSearch(data.data),
    pagination: mapJikanAnimePagination(data.pagination)
  }
}