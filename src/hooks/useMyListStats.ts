import { useMyAnimeList } from "../context/myListContext"

export function useMyListStats() {

  const {myList} = useMyAnimeList()
  const mediumScore = () => {
    const scoreList = myList.filter (anime => anime.scorePersonal)
    const scoreSum = scoreList.reduce((total, anime) => total + (anime.scorePersonal ?? 0), 0)
    return scoreSum/scoreList.length
  }

  const stats = {
    total: myList.length,
    watching: myList.filter( anime => anime.statusPersonal === "watching").length,
    completed: myList.filter( anime => anime.statusPersonal === "completed").length,
    dropped: myList.filter( anime => anime.statusPersonal === "dropped").length,
    planToWatch: myList.filter( anime => anime.statusPersonal === "planToWatch").length,
    episodesWatched: myList.reduce((total, anime) => total + (anime.episodesWatched ?? 0), 0),
    timeInHours: myList.reduce((total, anime) => total + (anime.episodesWatched ?? 0), 0) * 24 / 60,
    timeInDays: myList.reduce((total, anime) => total + (anime.episodesWatched ?? 0), 0) * 24 / 60 / 24,
    scoreMedia: mediumScore() 
  }

  return {stats}
}