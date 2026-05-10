import type { AnimeListType } from "../anime-list/anime-list.type";
import { jikanApiUrl } from "../apiAxios";
import type { JikanAnimeInformationType } from "../jikan-API.type";
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
  
  const {data} = await jikanApiUrl.get(`/anime/${animeID}`)
  
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
  const {data} = await jikanApiUrl.get(`/anime/${animeID}/characters`)

  return mapJikanAnimeCharacters(data.data)
}

export async function getAnimeInformationTypeList (animeID: number): Promise <AnimeListType> {
  const {data} = await jikanApiUrl.get(`/anime/${animeID}`)

  return mapJikanAnimeInformationToJikanAnimeList(data.data)
}