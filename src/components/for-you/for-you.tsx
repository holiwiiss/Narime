import { useQuery } from "@tanstack/react-query";
import LoadingComponent from "../loading-component/loading-component";
import ErrorComponent from "../error-component/error-component";
import type { AnimeCardType } from "../../services/anime-list/anime-list.type";
import AnimeCard from "../anime-card/anime-card";
import type { AnimeRecomendationCardType } from "../../services/anime-recommendations/anime-recommendations.type";
import { getRecomendationsAnimes } from "../../services/anime-recommendations/anime-recommendations";
import { useCallback, useMemo } from "react";
import { useMyListMap } from "../../hooks/use-my-list-map";
import { useAnimeModal } from "../../hooks/use-anime-modal";
import type { UserAnimeListFirestoreType } from "../../firebase/services/firestore-service.type";
import "./for-you.scss"
import ModalAddEditAnime from "../modals/modal-add-edit";
import { fetchMyList } from "../../view/my-list/my-list-information";
import { useMyAnimeList } from "../../hooks/use-my-list";

const fecthAnimesRecommendations = async (animeId:number, getUserListData: (id: number) => UserAnimeListFirestoreType | undefined
) => {
  const data = await getRecomendationsAnimes(animeId)
  return data.filter(a=> !getUserListData(a.id)) 
}

function getRandomAnime(myList: UserAnimeListFirestoreType[]) {
  const scoreCompleted = myList.filter((a: UserAnimeListFirestoreType)  => a.scorePersonal && a.statusPersonal === "completed")
  const betterScore = scoreCompleted.filter((a: UserAnimeListFirestoreType)  => a.scorePersonal && a.scorePersonal > 7)
  const betterScoreID = betterScore.map((a: UserAnimeListFirestoreType)  => ({ id: a.animeId, title: a.animeTitle }))

  if (betterScoreID.length > 0) {
    const randomNumber = Math.floor(Math.random() * betterScoreID.length)
    return { id: betterScoreID[randomNumber].id, title: betterScoreID[randomNumber].title }
  } else if (scoreCompleted.length > 0) {
    const randomNumber = Math.floor(Math.random() * scoreCompleted.length)
    return { id: scoreCompleted[randomNumber].animeId, title: scoreCompleted[randomNumber].animeTitle }
  } else {
    return { id: 16498, title: "Unknown" }
  }
}

const ForYou = () => {
  const {myList} = useMyAnimeList()
  const  { getUserListData } = useMyListMap()
  const modalAddEdit = useAnimeModal();

  const myListWatching = useMemo(() => {
    return myList.filter((a: UserAnimeListFirestoreType) => a.statusPersonal === "watching").slice(0, 5)
  }, [myList])

  const watchingIds = useMemo(() => {
    return myListWatching.map((a: UserAnimeListFirestoreType) => a.animeId)
  }, [myListWatching])

  const randomId = useMemo(() => getRandomAnime(myList), [myList])
  
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

  const openAddEditModal = useCallback((anime: AnimeCardType) => {
    const userData = getUserListData(anime.id);
    modalAddEdit.openModal(anime.id, anime.episodes, anime.title, userData);
  }, [getUserListData, modalAddEdit]);

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
          <span className="text-details text-color--75">(showing {myAnimeListWatching.length} of {myList.filter((a: UserAnimeListFirestoreType) => a.statusPersonal === "watching").length})</span>
        </div>
        <section className="cards__grid">
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
      ) : ( null )}

      { isLoadingRecommendations ? (
        <LoadingComponent></LoadingComponent>
      ) : !isLoadingRecommendations  && isErrorRecommendations ? (
        <ErrorComponent text="Something went wrong"></ErrorComponent>
      ) : recommendationsList && recommendationsList?.length ? (
        <>
          {randomId.title !== "Unknown" ? (<h2 className="text-h2 para-ti__subtitle">Because you liked {randomId.title}</h2>): (<h2 className="text-h2 para-ti__subtitle">Recommendations to get started</h2>)}
          <section className="cards__grid">
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
