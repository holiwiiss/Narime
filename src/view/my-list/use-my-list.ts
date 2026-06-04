import { useQuery } from "@tanstack/react-query";
import type { UserAnimeListFirestoreType } from "../../firebase/services/firestore-service.type";
import { fetchMyList } from "./my-list-information";


export const useMyList = (myList: UserAnimeListFirestoreType[]) =>{
   const {isLoading, isError, data} = useQuery({
    queryKey:["myAnimeList", myList.map((a: UserAnimeListFirestoreType) => a.animeId)], // useQuery compara el key para saber si relanzar la query
    queryFn: () => fetchMyList(myList),
    enabled: myList.length > 0,
  })

  return {
    isLoading,
    isError,
    myAnimeList: data ?? []
  }
}

