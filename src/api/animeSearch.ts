import { mapJikanAnimePagination } from "../mappers/animePaginationMapper";
import { mapJikanAnimeSearch } from "../mappers/animeSearchMapper";
import type { AnimeSearchResponse, AnimeSearchType } from "../types/api/animeSearchTyping";
import type { JikanResponseAnimeList } from "../types/api/JikanAPITyping";

const URL__JIKAN= 'https://api.jikan.moe/v4/'

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

export async function searchAnime(animeName:string): Promise<AnimeSearchResponse> {
  const request = URL__JIKAN + `anime?q=${animeName}&order_by=popularity&limit=5&sfw=true`;
  const response = await fetch(request);

  if (!response.ok) {
    throw new Error(`Error al llamar a la API: ${response.status}`);
  }
  
  const json: JikanResponseAnimeList = await response.json();

  const animes = mapJikanAnimeSearch(json.data)
  const pagination = mapJikanAnimePagination(json.pagination)

  return{
    animes: animes,
    pagination: pagination
  };
}