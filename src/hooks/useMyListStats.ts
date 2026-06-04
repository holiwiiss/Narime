import { useMemo } from "react"
import { useMyAnimeList } from "../context/my-list-context"
import type { UserAnimeListFirestoreType } from "../firebase/services/firestore-service.type"

export function useMyListStats() {

  const {myList} = useMyAnimeList()

  const stats = useMemo(() => {
    const scored = myList.filter((anime: UserAnimeListFirestoreType) => anime.scorePersonal)
    const scoreMedia = scored.length > 0
      ? scored.reduce((total, anime) => total + (anime.scorePersonal ?? 0), 0) / scored.length
      : 0
    const episodesWatched = myList.reduce((total, anime) => total + (anime.episodesWatched ?? 0), 0)

    return {
      total: myList.length,
      watching: myList.filter((anime) => anime.statusPersonal === "watching").length,
      completed: myList.filter((anime) => anime.statusPersonal === "completed").length,
      dropped: myList.filter((anime) => anime.statusPersonal === "dropped").length,
      planToWatch: myList.filter((anime) => anime.statusPersonal === "planToWatch").length,
      episodesWatched,
      timeInHours: episodesWatched * 24 / 60,
      timeInDays: episodesWatched * 24 / 60 / 24,
      scoreMedia: scoreMedia.toFixed(1)
    }
  }, [myList])
  
  return {stats}
}