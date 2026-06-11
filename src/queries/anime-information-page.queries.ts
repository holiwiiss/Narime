import { getAnimeCharacters, getAnimeInformation } from "../services/anime-information/anime-information";

export const fetchAnimeInformation = async (animeID:number) => {

 try {
    const [info, characters] = await Promise.all([
      getAnimeInformation(animeID),
      getAnimeCharacters(animeID)
    ]);

    return {
      info,
      characters,
    };
  } catch (error) {
    console.error("fetchAnimeInformation error", error);
    throw error;
  }


 
}