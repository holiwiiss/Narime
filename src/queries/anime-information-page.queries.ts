import { getAnimeCharacters, getAnimeInformation } from "../services/anime-information/anime-information";

export const fetchAnimeInformation = async (animeID:number) => {

  const [info, characters] = await Promise.all([
    getAnimeInformation(animeID),
    getAnimeCharacters(animeID)
  ]);

  return {
    info,
    characters,
  }
}