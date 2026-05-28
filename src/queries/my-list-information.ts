import type { UserAnimeListFirestoreType } from "../firebase/services/firestore-service.type";
import { getAnimeInformationTypeList } from "../services/anime-information/anime-information";
import type { AnimeCardType } from "../services/anime-list/anime-list.type";
import { delay } from "../utils/delay";

export const fetchMyList = async (myList: UserAnimeListFirestoreType[]) => {
  const results: AnimeCardType[] = [];
  
  for (const anime of myList) {
    const data = await getAnimeInformationTypeList(anime.animeId);
    results.push(data);
    await delay(400); 
  }
  
  return results;
}