import { mapJikanAnimeCharacters, mapJikanAnimeInformation } from "../mappers/animeInformationMapper";
import type { AnimeCharactersType, AnimeInformationType } from "../types/api/animeInformationTyping";
import type { JikanResponseAnimeCharacters, JikanResponseAnimeInformation } from "../types/api/JikanAPITyping";

const URL__JIKAN= 'https://api.jikan.moe/v4/'

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
  const request = URL__JIKAN + `anime/${animeID}`;
  const response = await fetch(request);

  if(!response.ok) {
    throw new Error(`Error al llamar a la API: ${response.status}`);
  }

  const json: JikanResponseAnimeInformation = await response.json()

  const animeInfo = mapJikanAnimeInformation(json.data)

  return animeInfo
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
  const request = URL__JIKAN + `anime/${animeID}/characters`;
  const response = await fetch(request);

  if(!response.ok) {
    throw new Error(`Error al llamar a la API: ${response.status}`);
  }

  const json: JikanResponseAnimeCharacters = await response.json()

  return mapJikanAnimeCharacters(json.data)
}