import { mapJikanAnimeCharacters, mapJikanAnimeInformation } from "../mappers/animeInformationMapper";
import type { AnimeCharactersResponse, AnimeCharactersType, AnimeInformationType, JikanResponseAnimeCharacters, JikanResponseAnimeInformation } from "../types/animeInformationTyping";

const URL__JIKAN= 'https://api.jikan.moe/v4/'

// tengo que hacer otra llamada para coger los personajes

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

export async function getAnimeCharacters(animeID:number): Promise <AnimeCharactersResponse> {
  const request = URL__JIKAN + `anime/${animeID}/characters`;
  const response = await fetch(request);

  if(!response.ok) {
    throw new Error(`Error al llamar a la API: ${response.status}`);
  }

  const json: JikanResponseAnimeCharacters = await response.json()

  const characters = mapJikanAnimeCharacters(json.data)

  return {
    data: characters,
  }
}