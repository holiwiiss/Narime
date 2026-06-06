import { useMemo } from "react";
import type { UserAnimeListFirestoreType } from "../firebase/services/firestore-service.type";
import { useMyAnimeList } from "./use-my-list";

export function useMyListMap() {

  const { myList } = useMyAnimeList()

  const myListMap = useMemo(() => {
    const map = new Map<number, UserAnimeListFirestoreType>();
    myList.forEach((anime) => {
      map.set(anime.animeId, anime);
    });
    
    return map;
  }, [myList]);

  const getUserListData = (animeId: number): UserAnimeListFirestoreType | undefined =>
  myListMap.get(animeId)
  
  return { myListMap, getUserListData}
}
