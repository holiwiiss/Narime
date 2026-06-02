import { useMemo } from "react";
import type { UserAnimeListFirestoreType } from "../firebase/services/firestore-service.type";
import { useMyAnimeList } from "../context/MyListContext";


export function useMyListMap() {

  const { myList } = useMyAnimeList()

  // antes recorria muchas veces el array por render, ahora busco la clave que es el id del
  // anime, y una vez obtenida obtengo los datos.
  const myListMap = useMemo(() => {
    const map = new Map<number, UserAnimeListFirestoreType>();

    myList.forEach((anime:any) => {
      map.set(anime.animeId, anime);
    });

    return map;
  }, [myList]);

  const getUserListData = (animeId: number): UserAnimeListFirestoreType | undefined =>
  myListMap.get(animeId)
  
  return { myListMap, getUserListData}
}
