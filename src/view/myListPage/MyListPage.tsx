import { useEffect, useMemo, useState } from "react";
import { getAnimeInformationTypeList } from "../../services/anime-information/anime-information";
import type { AnimePersonalStatusType, UserAnimeListFirestoreType } from "../../firebase/services/firestoreService.type";
import { useAnimeModal } from "../../hooks/useAnimeModal";
import ModalAddEditAnime from "../../components/modalAddEditAnime/ModalAddEditAnime";
import { useMyAnimeList } from "../../context/MyListContext";
import type { AnimeListType } from "../../services/anime-list/anime-list.type";
import AnimeCard from "../../components/animeCard/AnimeCard";
import { useMyListMap } from "../../hooks/useMyListMap";

const MyListPage = () =>{

  const { myList } = useMyAnimeList()
  const  { myListMap, getUserListData } = useMyListMap()
  const modalAddEdit= useAnimeModal()

  const [animeList, setAnimeList] = useState<AnimeListType[]>([]);
  const [activeCategory, setActiveCategory] = useState <"all" | AnimePersonalStatusType>("all")

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        if(!myList) return 
        const JSON: AnimeListType[] = await Promise.all(
            myList.map( async (anime: UserAnimeListFirestoreType) => {
              const apiData = await getAnimeInformationTypeList(anime.animeId);
              return  apiData
            })
        );
        setAnimeList(JSON)
      } catch (e) {
        console.log("La api no responde " + e);
      }
    };
    fetchAnimes();
  }, [myList]);

  const countersList = {
    all: myList.length,
    watching: myList.filter( anime => anime.statusPersonal === "watching").length,
    completed: myList.filter( anime => anime.statusPersonal === "completed").length,
    dropped: myList.filter( anime => anime.statusPersonal === "dropped").length,
    planToWatch: myList.filter( anime => anime.statusPersonal === "planToWatch").length
  }

  const listToShow = useMemo(() => {
    if (activeCategory === "all") return animeList;
    
    return animeList.filter( anime => {
      const userData = getUserListData(anime.id)
      if(userData?.statusPersonal === activeCategory) return true
    })

  }, [animeList, activeCategory, myListMap]);

  const openAddEditModal = (animeId: number) =>{
    const userData = myListMap.get(animeId);
    modalAddEdit.openModal(animeId, userData);
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
          {listToShow.length === 0 ? (
            <h1>No se han encontrado animes</h1>
          ) : (
            listToShow.map((anime: AnimeListType) => {
                      return (
                        <AnimeCard
                          key={anime.id}
                          anime={anime}
                          userData={getUserListData(anime.id)}
                          onOpenModal={openAddEditModal}
                        >
                        </AnimeCard>
                      )})
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