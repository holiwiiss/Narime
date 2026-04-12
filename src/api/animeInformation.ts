import { mapJikanAnimeCharacters, mapJikanAnimeInformation } from "../mappers/animeInformationMapper";
import type { AnimeCharactersType, AnimeInformationType } from "../types/api/animeInformationTyping";
import type { JikanResponseAnimeCharacters, JikanResponseAnimeInformation } from "../types/api/JikanAPITyping";

const URL__JIKAN= 'https://api.jikan.moe/v4/'




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

export async function getAnimeCharacters(animeID:number): Promise <AnimeCharactersType[]> {
  const request = URL__JIKAN + `anime/${animeID}/characters`;
  const response = await fetch(request);

  if(!response.ok) {
    throw new Error(`Error al llamar a la API: ${response.status}`);
  }

  const json: JikanResponseAnimeCharacters = await response.json()

  return mapJikanAnimeCharacters(json.data)
}