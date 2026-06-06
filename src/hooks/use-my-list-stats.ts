import { useMemo } from "react"

import type { UserAnimeListFirestoreType } from "../firebase/services/firestore-service.type"
import { useMyAnimeList } from "./use-my-list"

export function useMyListStats() {

  const {myList} = useMyAnimeList()

  const stats = useMemo(() => {
    const scored = myList.filter((anime: UserAnimeListFirestoreType) => anime.scorePersonal)
    const scoreMedia = scored.length > 0
      ? scored.reduce((total:number, anime: UserAnimeListFirestoreType) => total + (anime.scorePersonal ?? 0), 0) / scored.length
      : 0
    const episodesWatched = myList.reduce((total:number, anime: UserAnimeListFirestoreType) => total + (anime.episodesWatched ?? 0), 0)

    return {
      total: myList.length,
      watching: myList.filter((anime: UserAnimeListFirestoreType) => anime.statusPersonal === "watching").length,
      completed: myList.filter((anime: UserAnimeListFirestoreType) => anime.statusPersonal === "completed").length,
      dropped: myList.filter((anime: UserAnimeListFirestoreType) => anime.statusPersonal === "dropped").length,
      planToWatch: myList.filter((anime: UserAnimeListFirestoreType) => anime.statusPersonal === "planToWatch").length,
      episodesWatched,
      timeInHours: episodesWatched * 24 / 60,
      timeInDays: episodesWatched * 24 / 60 / 24,
      scoreMedia: scoreMedia.toFixed(1)
    }
  }, [myList])
  
  return {stats}
}