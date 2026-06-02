import { useMyAnimeList } from "../context/MyListContext"

export function useMyListStats() {

  const {myList} = useMyAnimeList()
  const mediumScore = () => {
    const scoreList = myList.filter ((anime: any) => anime.scorePersonal)
    const scoreSum = scoreList.reduce((total: any, anime:any) => total + (anime.scorePersonal ?? 0), 0)
    return scoreSum/scoreList.length
  }

  const stats = {
    total: myList.length,
    watching: myList.filter((anime: any) => anime.statusPersonal === "watching").length,
    completed: myList.filter((anime: any) => anime.statusPersonal === "completed").length,
    dropped: myList.filter((anime: any)=> anime.statusPersonal === "dropped").length,
    planToWatch: myList.filter((anime: any) => anime.statusPersonal === "planToWatch").length,
    episodesWatched: myList.reduce((total:any, anime:any)=> total + (anime.episodesWatched ?? 0), 0),
    timeInHours: myList.reduce((total:any, anime:any) => total + (anime.episodesWatched ?? 0), 0) * 24 / 60,
    timeInDays: myList.reduce((total:any, anime:any) => total + (anime.episodesWatched ?? 0), 0) * 24 / 60 / 24,
    scoreMedia: mediumScore() 
  }

  return {stats}
}