import { useEffect, useMemo, useState } from "react";
import type { AnimeInformationType } from "../../services/anime-information/anime-information.type";
import { getAnimeInformation } from "../../services/anime-information/anime-information";
import { useNavigate } from "react-router-dom";
import { getAllAnimesFirebase } from "../../firebase/services/firestoreService";
import { useAuth } from "../../context/AuthContext";
import type { AnimePersonalStatusType, UserAnimeListFirestoreType } from "../../firebase/services/firestoreService.type";
import { useAnimeModal } from "../../hooks/useAnimeModal";
import ModalAddEditAnime from "../../components/modalAddEditAnime/ModalAddEditAnime";
import { useMyAnimeList } from "../../context/MyListContext";

const MyListPage = () =>{

  const navigate = useNavigate()
  const { user } = useAuth ()
  const { myList } = useMyAnimeList()
  const modalAddEdit= useAnimeModal()

  const [animeList, setAnimeList] = useState<MyListAnime[]>([]);
  const [activeCategory, setActiveCategory] = useState <"all" | AnimePersonalStatusType>("all")

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        if(!myList) return 
        const JSON: MyListAnime[] = await Promise.all(
            myList.map( async (anime: UserAnimeListFirestoreType) => {
              const apiData = await getAnimeInformation(anime.animeId);
              return  apiData
            })
        );
        setAnimeList(JSON)
      } catch (e) {
        console.log("La api no responde " + e);
      }
    };
    fetchAnimes();
  }, [user]);

  const countersList = {
    all: myList.length,
    watching: myList.filter( anime => anime.statusPersonal === "watching").length,
    completed: myList.filter( anime => anime.statusPersonal === "completed").length,
    dropped: myList.filter( anime => anime.statusPersonal === "dropped").length,
    planToWatch: myList.filter( anime => anime.statusPersonal === "planToWatch").length
  }

  const listToShow = useMemo(() => {
    if (activeCategory === "all") return animeList;
    return animeList.filter( anime => anime.user.statusPersonal === activeCategory);
  }, [animeList, activeCategory]);

  const openAddEditModal = () =>{

  }

return(
  <>
    <div className="bton__container">
      <button className={activeCategory === 'all' ? "bton btn__able" : " bton btn__disable "} onClick={() => setActiveCategory("all")}>All ({countersList.all})</button>
      <button className={activeCategory === 'watching' ? "bton btn__able" : " bton btn__disable"} onClick={() => setActiveCategory("watching")}>Watching ({countersList.watching})</button>
      <button className={activeCategory === 'completed' ? "bton btn__able" : " bton btn__disable"} onClick={() => setActiveCategory("completed")}>Completed ({countersList.completed})</button>
      <button className={activeCategory === 'dropped' ? "bton btn__able" : " bton btn__disable"} onClick={() => setActiveCategory("dropped")}>Dropped ({countersList.dropped})</button>
      <button className={activeCategory === 'planToWatch' ? "bton btn__able" : " bton btn__disable"} onClick={() => setActiveCategory("planToWatch")}>Plan to watch ({countersList.planToWatch})</button>
    </div>

    <div className="cards__container">
          {animeList.length === 0 ? (
            <h1>No se han encontrado animes</h1>
          ) : (
            listToShow.map((anime: MyListAnime) => (
              <div key={anime.user.animeId} className="anime__card" onClick={() => navigate(`/anime/${anime.user.animeId}`)}>
                <h1>{anime.api.title}</h1>
                <img src={anime.api.images}/>
                <div className="information__container">
                  <h2>Score: {anime.api.score}</h2>
                  <h2>Episodes: {anime.api.episodes}</h2>
                  <h3>My Status: {anime.user.statusPersonal}</h3>
                  <h3>My Score: {anime.user.scorePersonal}</h3>
                  <h3>Watched: {anime.user.episodesWatched}</h3>
                </div>
                <button onClick={openAddEditModal}></button>
              </div>
            ))
          )}

          {modalAddEdit.isOpen && modalAddEdit.animeId &&(
            <ModalAddEditAnime
            animeId={modalAddEdit.animeId}
            action={modalAddEdit.action}
            infoDocIdUserAnime = {modalAddEdit.infoDocIdFromUser}
            onClose={modalAddEdit.closeModal}
            />
          )}
    </div>
  </>
)
}

export default MyListPage;