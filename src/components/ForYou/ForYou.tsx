import { useQuery } from "@tanstack/react-query";
import { useMyAnimeList } from "../../context/myListContext";
import { fetchMyList } from "../../queries/my-list-information";
import LoadingComponent from "../Loading/LoadingComponent";
import ErrorComponent from "../Error/ErrorComponent";
import type { AnimeCardType } from "../../services/anime-list/anime-list.type";
import AnimeCard from "../AnimeCard/AnimeCard";
import type { AnimeRecomendationCardType } from "../../services/anime-recommendations/anime-recommendations.type";
import { getRecomendationsAnimes } from "../../services/anime-recommendations/anime-recommendations";
import { useMemo } from "react";
import { useMyListMap } from "../../hooks/useMyListMap";
import { useAnimeModal } from "../../hooks/useAnimeModal";

import type { UserAnimeListFirestoreType } from "../../firebase/services/firestore-service.type";
import "./forYou.scss"
import ModalAddEditAnime from "../modals/ModalAddEditAnime/ModalAddEditAnime";

const fecthAnimesRecommendations = async (animeId:number, getUserListData: (id: number) => UserAnimeListFirestoreType | undefined
) => {
  const data = await getRecomendationsAnimes(animeId)
  return data.filter((a:any)=> !getUserListData(a.id)) 
}

const ForYou = () => {
  
  const {myList} = useMyAnimeList()
  const  { getUserListData } = useMyListMap()
  const modalAddEdit = useAnimeModal();

  const myListWatching = useMemo(() => {
    return myList.filter((a:any) => a.statusPersonal === "watching").slice(0, 5)
  }, [myList])

  const watchingIds = useMemo(() => {
    return myListWatching.map((a:any) => a.animeId)
  }, [myListWatching])

  const randomId = useMemo(() => {
    const scoreCompleted = myList.filter((a:any) => a.scorePersonal && a.statusPersonal === "completed")
    const betterScore = scoreCompleted.filter((a:any)=>  a.scorePersonal && a.scorePersonal > 7)
    const betterScoreID = betterScore.map((a:any)=> ({ id: a.animeId, title: a.animeTitle }))

    if (betterScoreID.length > 0) {
      const randomNumber = Math.floor(Math.random() * betterScoreID.length)
      return ({id: betterScoreID[randomNumber].id, title: betterScoreID[randomNumber].title})
    } else if (scoreCompleted.length > 0) {
      const randomNumber = Math.floor(Math.random() * scoreCompleted.length)
      return ({id: scoreCompleted[randomNumber].animeId, title: scoreCompleted[randomNumber].animeTitle})
    } else {
      return { id: 16498, title: "Unknown" }
    }
  }, [])
  
  const {isLoading: isLoadingWatching, isError: isErrorWatching, data: myAnimeListWatching} = useQuery({
    queryKey:["myAnimeListWatching", watchingIds],
    queryFn: () => fetchMyList(myListWatching),
    enabled: myListWatching.length > 0,
  })

  const {isLoading: isLoadingRecommendations, isError: isErrorRecommendations, data: recommendationsList} = useQuery({
    queryKey:["recommendationsList", randomId.id],
    queryFn: () => fecthAnimesRecommendations(randomId.id, getUserListData),
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
        <div className="header-for-you">
          <h1 className="text-h1 para-ti__title">Currently watching...</h1>
          <span className="text-details text-color--75">(showing {myAnimeListWatching.length} of {myList.filter(a => a.statusPersonal === "watching").length})</span>
        </div>
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
          {randomId.title !== "Unknown" ? (<h2 className="text-h2 para-ti__subtitle">Because you liked {randomId.title}</h2>): (<h2 className="text-h2 para-ti__subtitle">Recommendations to get started</h2>)}
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

export default ForYou;
