import { useEffect, useMemo, useState } from "react";
import { getAnimeInformationTypeList } from "../../services/anime-information/anime-information";
import type { AnimePersonalStatusType } from "../../firebase/services/firestoreService.type";
import { useAnimeModal } from "../../hooks/useAnimeModal";
import ModalAddEditAnime from "../../components/modalAddEditAnime/ModalAddEditAnime";
import { useMyAnimeList } from "../../context/MyListContext";
import type { AnimeListType } from "../../services/anime-list/anime-list.type";
import AnimeCard from "../../components/animeCard/AnimeCard";
import { useMyListMap } from "../../hooks/useMyListMap";
import { Link } from "react-router-dom";
import "./myListPage.scss"
import LoadingComponent from "../../components/loading/LoadingComponent";
import ErrorComponent from "../../components/error/ErrorComponent";

const MyListPage = () =>{

  const { myList } = useMyAnimeList()
  const  { myListMap, getUserListData } = useMyListMap()
  const modalAddEdit= useAnimeModal()

  const [animeList, setAnimeList] = useState<AnimeListType[]>([]);
  const [activeCategory, setActiveCategory] = useState <"all" | AnimePersonalStatusType>("all");
  const [searchAnime, setSearchAnime] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    const fetchAnimes = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        if(!myList) return 
        const JSON: AnimeListType[] = []
        myList.forEach(async anime => {
          const data = await getAnimeInformationTypeList(anime.animeId);
          JSON.push(data);
          await delay(400); 
        });
        setAnimeList(JSON)
      } catch (e) {
        console.log("La api no responde " + e);
        setIsError(true)
      }finally{
        setIsLoading(false)
      }
    };
    fetchAnimes();
  }, [myList]);

  const delay = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

  const countersList = {
    all: myList.length,
    watching: myList.filter( anime => anime.statusPersonal === "watching").length,
    completed: myList.filter( anime => anime.statusPersonal === "completed").length,
    dropped: myList.filter( anime => anime.statusPersonal === "dropped").length,
    planToWatch: myList.filter( anime => anime.statusPersonal === "planToWatch").length
  }

  const listToShow = useMemo(() => {
    let definitiveList: AnimeListType[] = []

    if (activeCategory === "all"){
      definitiveList = animeList
    } 
    
    if(activeCategory !== "all"){
      definitiveList = animeList.filter( anime => {
        const userData = getUserListData(anime.id)
        if(userData?.statusPersonal === activeCategory) return true
      })
    }
    
    if(searchAnime) {
      return definitiveList.filter( anime =>{
        const title = anime.title.toLowerCase()
        const search = searchAnime.toLowerCase()
        if(title.startsWith(search)) return true
      })
    }
    return definitiveList
  }, [animeList, activeCategory, myListMap, searchAnime]);

  const openAddEditModal = (anime: AnimeListType) => {
    const userData = myListMap.get(anime.id);
    modalAddEdit.openModal(anime.id, anime.episodes, userData);
  }

return(
  <>
    <div className="my-list__options tab__container">
      <div className="tab__buttons">
        <button className={`tab-option ${activeCategory === 'all' ? "tab-option__selected" : "tab-option__unselected"}`} onClick={() => setActiveCategory("all")}>All <span className="tab-option__count">({countersList.all})</span></button>
        <button className={`tab-option ${activeCategory === 'watching' ? "tab-option__selected" : "tab-option__unselected"}`} onClick={() => setActiveCategory("watching")}>Watching <span className="tab-option__count">({countersList.watching})</span></button>
        <button className={`tab-option ${activeCategory === 'completed' ? "tab-option__selected" : "tab-option__unselected"}`} onClick={() => setActiveCategory("completed")}>Completed <span className="tab-option__count">({countersList.completed})</span></button>
        <button className={`tab-option ${activeCategory === 'dropped' ? "tab-option__selected" : "tab-option__unselected"}`} onClick={() => setActiveCategory("dropped")}>Dropped <span className="tab-option__count">({countersList.dropped})</span></button>
        <button className={`tab-option ${activeCategory === 'planToWatch' ? "tab-option__selected" : "tab-option__unselected"}`} onClick={() => setActiveCategory("planToWatch")}>Plan to watch <span className="tab-option__count">({countersList.planToWatch})</span></button>
      </div>
      <div className="my-list__filters">
        <div className="my-list__search">
          <img className="my-list__search--img"></img>
          <input type="text" className="my-list__input" onInput={(event: React.InputEvent<HTMLInputElement>) => setSearchAnime(event.currentTarget.value)} placeholder="Search anime..."></input>
        </div>
      </div>
    </div>

    {isLoading ? (
      <LoadingComponent text="Chargin animes..." />
    ) : isError ? (
      <ErrorComponent text="Ha habido un error con la API" />
    ) : listToShow.length === 0 && searchAnime ?(
      <div>
        <h1>(⁠╥⁠﹏⁠╥⁠)</h1>
        <h2>No hay ningun anime llamado asi</h2>
      </div>
    ) : listToShow.length === 0 ? (
      <>
        <h1>(⁠╥⁠﹏⁠╥⁠)</h1>
        <h2>No hay animes todavia</h2>
        <Link to={"/directory"} className="btn-primary"> Add animes to your list</Link>
      </>
    )  : (
          <div className="anime-cards__container">
              {listToShow.map((anime: AnimeListType) =>(
                <AnimeCard
                  key={anime.id}
                  anime={anime}
                  userData={getUserListData(anime.id)}
                  onOpenModal={() => openAddEditModal(anime)}
                >
                </AnimeCard>
              ))}
            </div>
          )}
  
          {modalAddEdit.isOpen && modalAddEdit.animeId &&(
            <ModalAddEditAnime
            animeId={modalAddEdit.animeId}
            totalEpisodes = {modalAddEdit.animeEpisodes}
            action={modalAddEdit.action}
            infoDocIdUserAnime = {modalAddEdit.infoDocIdFromUser}
            onClose={modalAddEdit.closeModal}
            />
          )}
  </>
)
}

export default MyListPage;