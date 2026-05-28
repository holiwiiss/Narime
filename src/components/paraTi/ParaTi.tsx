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
import { useMyListMap } from "../../hooks/useMyListMap";
import { useAnimeModal } from "../../hooks/useAnimeModal";
import ModalAddEditAnime from "../modalAddEditAnime/ModalAddEditAnime";
import type { UserAnimeListFirestoreType } from "../../firebase/services/firestoreService.type";
import "./parati.scss"

const fecthAnimesRecommendations = async (animeId:number, getUserListData: (id: number) => UserAnimeListFirestoreType | undefined
) => {
  const data = await getRecomendationsAnimes(animeId)
  return data.filter(a => !getUserListData(a.id)) 
}

const ParaTi = () => {
  
  const {myList} = useMyAnimeList()
  const  { getUserListData } = useMyListMap()
  const modalAddEdit = useAnimeModal();

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
    queryFn: () => fecthAnimesRecommendations(randomId, getUserListData),
    enabled: myList.length > 0
  })

  const openAddEditModal = (anime: AnimeCardType) => {
    const userData = getUserListData(anime.id);
    modalAddEdit.openModal(anime.id, anime.episodes, anime.title, userData);
  };

  return (
    <>
      {isLoadingWatching ? (
        <LoadingComponent/>
      ) : !isLoadingWatching && isErrorWatching ? (
        <ErrorComponent text="Something went wrong"></ErrorComponent>
      ): myAnimeListWatching && myAnimeListWatching.length > 0  ? (
        <>
        <h1 className="text-h1 para-ti__title">Currently watching...</h1>
        <section className="anime-cards__container">
          {myAnimeListWatching.map((anime: AnimeCardType) => (
            <AnimeCard
              key={anime.id}
              anime={anime}
              userData={getUserListData(anime.id)}
              onOpenModal={() => openAddEditModal(anime)}
              variant="mylist"
            />
          ))}
        </section>
        </>
      ) : (
        <>
        </>
      )}

      { isLoadingRecommendations ? (
        <LoadingComponent></LoadingComponent>
      ) : !isLoadingRecommendations  && isErrorRecommendations ? (
        <ErrorComponent text="Something went wrong"></ErrorComponent>
      ) : recommendationsList && recommendationsList?.length ? (
        <>
          {scoreCompleted.length > 0 && betterScoreID.length > 0  ? (<h2 className="text-h2 para-ti__subtitle">Because you liked X</h2>): (<h2 className="text-h2 para-ti__subtitle">Recommendations to get started</h2>)}
          <section className="anime-cards__container">
          {recommendationsList.map((anime: AnimeRecomendationCardType) => (
                      <AnimeCard
                        key={anime.id}
                        anime={anime}
                        variant="recomendations"
                      />
          ))}
        </section>
        </>
      ) : (
        <>
          <h1>No recommendations found</h1>
        </>
      )}
        {modalAddEdit.isOpen && modalAddEdit.animeId &&(
          <ModalAddEditAnime
          animeId={modalAddEdit.animeId}
          totalEpisodes = {modalAddEdit.animeEpisodes}
          animeTitle={modalAddEdit.animeTitle}
          action={modalAddEdit.action}
          infoDocIdUserAnime = {modalAddEdit.infoDocIdFromUser}
          onClose={modalAddEdit.closeModal}
        />
      )}
    </>
  );
};

export default ParaTi;
