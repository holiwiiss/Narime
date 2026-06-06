import { useCallback } from "react"
import type { UserAnimeListFirestoreType } from "../../firebase/services/firestore-service.type"
import type { AnimeCardType } from "../../services/anime-list/anime-list.type"

type GetUserListData = (id: number) => UserAnimeListFirestoreType | undefined

export const useMyListOrder = (myAnimeList: AnimeCardType[], getUserListData: GetUserListData) => {

  const orderByStatus = useCallback(() =>{
    const watchingList = myAnimeList.filter((anime) => getUserListData(anime.id)?.statusPersonal === "watching")
    const completedList = myAnimeList.filter((anime) => getUserListData(anime.id)?.statusPersonal === "completed")
    const droppedList = myAnimeList.filter((anime) => getUserListData(anime.id)?.statusPersonal === "dropped")
    const planList = myAnimeList.filter((anime) => getUserListData(anime.id)?.statusPersonal === "planToWatch")
    return [...watchingList, ...completedList, ...droppedList, ...planList]
  }, [myAnimeList, getUserListData])

  const orderByAlphabetical = useCallback(() => {
    return [...myAnimeList].sort((a, b) => {
      if (a.title > b.title) return 1
      if(a.title < b.title) return -1
      return 0
    })
  },[myAnimeList])

  const orderByScore = useCallback(() => {
    return  [...myAnimeList].sort((a, b) => {
      const scoreA = getUserListData(a.id)?.scorePersonal ?? 0
      const scoreB = getUserListData(b.id)?.scorePersonal ?? 0
      return scoreB - scoreA
    })
  },[myAnimeList, getUserListData])

  const orderByEpisodesWatched = useCallback(() => {
    return [...myAnimeList].sort((a, b) => {
      const epA = getUserListData(a.id)?.episodesWatched ?? 0
      const epB = getUserListData(b.id)?.episodesWatched ?? 0
      return epB - epA
    })
  },[myAnimeList, getUserListData])

  return {orderByStatus, orderByAlphabetical, orderByScore, orderByEpisodesWatched}

}