import { getAnimeInformationTypeList } from "../services/anime-information/anime-information";
import type { AnimeCardType } from "../services/anime-list/anime-list.type";
import { delay } from "../utils/delay";

export const fetchMyFavoriteList = async (list: number[]) => {
  const results: AnimeCardType[] = [];
    for (const anime of list) {
      const data = await getAnimeInformationTypeList(anime);
      results.push(data);
      await delay(400); 
    }
    
  return results;
}