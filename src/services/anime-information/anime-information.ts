import type { AnimeCardType } from "../anime-list/anime-list.type";
import { jikanApiUrl } from "../apiAxios";
import type { JikanAnimeCharactersType, JikanAnimeInformationType } from "../jikan-API.type";
import { mapJikanAnimeCharacters, mapJikanAnimeInformation, mapJikanAnimeInformationToJikanAnimeList } from "./anime-information.mapper";
import type { AnimeCharactersType, AnimeInformationType } from "./anime-information.type";

/**
 *  Obtiene la información detallada de un anime por su ID
 *
 * @param animeID - ID del anime en MyAnimeList
 * @returns objeto AnimeInformationType
 * 
 * Ejemplo de respuesta:
 * 
 * animeInfo = {
 *   id: 1,
 *   title: "Naruto",
 *   title_english: "Naruto",
 *   type: "TV",
 *   ...
 * }
 *    
 */

export async function getAnimeInformation(animeID:number): Promise<AnimeInformationType>{
  
  const {data} = await jikanApiUrl.get<{ data: JikanAnimeInformationType }>(`/anime/${animeID}`);
  
  return mapJikanAnimeInformation(data.data)
}

/**
 *  Obtiene los personajes de un anime por su ID
 *
 * @param animeID - ID del anime en MyAnimeList
 * @returns array de AnimeCharactersType (mapeado)
 * 
 * Ejemplo de respuesta:
 * 
 * character = [
 *   {character_name: 'nombre personaje', character_image: 'url', role:'protagonita', voice_actor_name: 'nombre actor', voice_actor_image: 'url'},
 *   {character_name: 'nombre personaje', character_image: 'url', role:'protagonita', voice_actor_name: 'nombre actor', voice_actor_image: 'url'}
 * ]
 */

export async function getAnimeCharacters(animeID:number): Promise <AnimeCharactersType[]> {
  const {data} = await jikanApiUrl.get<{ data: JikanAnimeCharactersType []}>(`/anime/${animeID}/characters`)

  return mapJikanAnimeCharacters(data.data)
}

/**
 *  Obtiene la información detallada de un anime por su ID en mappeado en formato lista para las cards
 *
 * @param animeID - ID del anime en MyAnimeList
 * @returns objeto AnimeListType
 * 
 * Ejemplo de respuesta:
 * 
 * animeInfo = {
 *   id: 1,
 *   title: "Naruto",
 *   type: "TV",
 *   ...
 * }
 *    
 */
export async function getAnimeInformationTypeList (animeID: number): Promise <AnimeCardType> {
  const {data} = await jikanApiUrl.get<{ data: JikanAnimeInformationType}>(`/anime/${animeID}`)
  return mapJikanAnimeInformationToJikanAnimeList(data.data)
}