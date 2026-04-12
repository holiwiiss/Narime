import { mapJikanAnimeSearch } from "../mappers/animeSearchMapper";
import type { AnimeSearchType } from "../types/api/animeSearchTyping";
import type { JikanResponseAnimeList } from "../types/api/JikanAPITyping";

const URL__JIKAN= 'https://api.jikan.moe/v4/'

/**
 *  Busca animes por nombre usando Jikan API
 *
 * @param animeName - texto de búsqueda
 * @returns array de AnimeSearchType (ya mapeados)
 * 
 * Ejemplo de respuesta:
 * 
 * animes = [
 *   {id: 123, title: 'ejemplo', image: 'url', type: 'TV'},
 *   {id: 123, title: 'ejemplo', image: 'url', type: 'TV'}, 
 * ]
 */

export async function searchAnime(animeName:string): Promise<AnimeSearchType[]> {
  const request = URL__JIKAN + `anime?q=${animeName}&sfw=true`;
  const response = await fetch(request);

  if (!response.ok) {
    throw new Error(`Error al llamar a la API: ${response.status}`);
  }
  
  const json: JikanResponseAnimeList = await response.json();

  return mapJikanAnimeSearch(json.data)
}