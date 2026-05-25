import { useQuery } from "@tanstack/react-query";
import { useMyAnimeList } from "../../context/MyListContext";
import { fetchMyList } from "../../queries/my-list-information";
import LoadingComponent from "../loading/LoadingComponent";
import ErrorComponent from "../error/ErrorComponent";
import type { AnimeCardType } from "../../services/anime-list/anime-list.type";
import AnimeCard from "../animeCard/AnimeCard";
import type { AnimeRecomendationCardType } from "../../services/anime-recommendations/anime-recommendations.type";
import { getRecomendationsAnimes } from "../../services/anime-recommendations/anime-recommendations";
import { useMemo } from "react";

const fecthAnimesRecommendations = async (animeId:number) => {
  const data: AnimeRecomendationCardType[] = await getRecomendationsAnimes(animeId)
  return data
}

const ParaTi = () => {
  
  const {myList} = useMyAnimeList()
  const myListWatching = myList.filter(a => a.statusPersonal === "watching")
  const scoreCompleted = myList.filter(a => a.scorePersonal && a.statusPersonal === "completed")
  const betterScore = scoreCompleted.filter(a =>  a.scorePersonal && a.scorePersonal > 7)
  const betterScoreID = betterScore.map(a => a.animeId)
  
  const randomId = useMemo(() => {
    if (betterScoreID.length > 0) {
      return betterScoreID[Math.floor(Math.random() * betterScoreID.length)]
    } else if (scoreCompleted.length > 0) {
      return scoreCompleted[Math.floor(Math.random() * scoreCompleted.length)].animeId
    } else {
      return 16498
    }
  }, [])
  
  const {isLoading: isLoadingWatching, isError: isErrorWatching, data: myAnimeListWatching} = useQuery({
    queryKey:["myAnimeListWatching", myListWatching.map(a => a.animeId)],
    queryFn: () => fetchMyList(myListWatching),
    enabled: myListWatching.length > 0,
  })

  const {isLoading: isLoadingRecommendations, isError: isErrorRecommendations, data: recommendationsList} = useQuery({
    queryKey:["recommendationsList", randomId],
    queryFn: () => fecthAnimesRecommendations(randomId),
    enabled: myList.length > 0
  })


  return (
    <>
      {isLoadingWatching ? (
        <LoadingComponent></LoadingComponent>
      ) : !isLoadingWatching && isErrorWatching ? (
        <ErrorComponent text="Ha ocurrido un errorr"></ErrorComponent>
      ): myAnimeListWatching && myAnimeListWatching.length > 0  ? (
        <section>
          {myAnimeListWatching.map((anime: AnimeCardType) => (
                      <AnimeCard
                        key={anime.id}
                        anime={anime}
                      />
          ))}
        </section>
      ) : (
        <>
        </>
      )}

      { isLoadingRecommendations ? (
        <LoadingComponent></LoadingComponent>
      ) : !isLoadingRecommendations  && isErrorRecommendations ? (
        <ErrorComponent text="Ha habido un error"></ErrorComponent>
      ) : recommendationsList && recommendationsList?.length ? (
        <section>
          {scoreCompleted.length > 0 && betterScoreID.length > 0  ? (<h1>Porque te gustó x</h1>): (<h1>Recomendaciones para emprezar</h1>)}
          {recommendationsList.map((anime: AnimeRecomendationCardType) => (
            <div>
              <h1>{anime.title}</h1>

            </div>
          ))}
        </section>
      ) : (
        <>
          <h1> No hay recomendaciones </h1>
        </>
      )}

    </>
  );
};

export default ParaTi;
