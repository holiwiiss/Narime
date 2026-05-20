import { useMemo, useState } from "react";
import { getAnimeInformationTypeList } from "../../services/anime-information/anime-information";
import type { AnimePersonalStatusType, UserAnimeListFirestoreType } from "../../firebase/services/firestoreService.type";
import { useAnimeModal } from "../../hooks/useAnimeModal";
import ModalAddEditAnime from "../../components/modalAddEditAnime/ModalAddEditAnime";
import { useMyAnimeList } from "../../context/MyListContext";
import type { AnimeCardType } from "../../services/anime-list/anime-list.type";
import AnimeCard from "../../components/animeCard/AnimeCard";
import { useMyListMap } from "../../hooks/useMyListMap";
import { Link } from "react-router-dom";
import "./myListPage.scss"
import LoadingComponent from "../../components/loading/LoadingComponent";
import ErrorComponent from "../../components/error/ErrorComponent";
import { useQuery } from "@tanstack/react-query";
import { delay } from "../../utils/delay";

const fetchMyList = async (myList: UserAnimeListFirestoreType[]) => {
  const results: AnimeCardType[] = [];
  
  for (const anime of myList) {
    const data = await getAnimeInformationTypeList(anime.animeId);
    results.push(data);
    await delay(400); 
  }
  
  return results;
}

const MyListPage = () =>{

  const { myList } = useMyAnimeList()
  const  { myListMap, getUserListData } = useMyListMap()
  const modalAddEdit= useAnimeModal()

  const OrderList = ["Status", "Alphabetical", "Score", "Watched Episodes", "Last Updated"]
  const [activeCategory, setActiveCategory] = useState <"all" | AnimePersonalStatusType>("all");
  const [searchAnime, setSearchAnime] = useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = useState("");

  const {isLoading, isError, data} = useQuery({
    queryKey:["myAnimeList", myList.map(a => a.animeId)], // useQuery compara el key para saber si relanzar la query
    queryFn: () => fetchMyList(myList),
    enabled: myList.length > 0,
  })

  const myAnimeList: AnimeCardType[] = data ?? []

  const countersList = {
    all: myList.length,
    watching: myList.filter( anime => anime.statusPersonal === "watching").length,
    completed: myList.filter( anime => anime.statusPersonal === "completed").length,
    dropped: myList.filter( anime => anime.statusPersonal === "dropped").length,
    planToWatch: myList.filter( anime => anime.statusPersonal === "planToWatch").length
  }

  const orderByStatus = () => {
    const watchingList = myAnimeList.filter( anime => {
        const userData = getUserListData(anime.id)
        if(userData?.statusPersonal === "watching") return true
      })

      const completedList = myAnimeList.filter( anime => {
        const userData = getUserListData(anime.id)
        if(userData?.statusPersonal === "completed") return true
      })

      const droppedList = myAnimeList.filter( anime => {
        const userData = getUserListData(anime.id)
        if(userData?.statusPersonal === "dropped") return true
      })

      const planList =  myAnimeList.filter( anime => {
        const userData = getUserListData(anime.id)
        if(userData?.statusPersonal === "planToWatch") return true
      })

      const finalList = [...watchingList, ...completedList, ...droppedList, ...planList]
      return finalList
  }

  const orderByAlphabetical = () => {
    const FinalList = myAnimeList.sort(function (a, b){
      if(a.title > b.title){
        return 1;
      }
      if(a.title < b.title){
        return -1
      }
      return 0
    })
    return FinalList
  }

  const orderByScore = () => {
    const FinalList = myAnimeList.sort(function (a , b){
      const userDataA = getUserListData(a.id)?.scorePersonal ?? 0
      const userDataB = getUserListData(b.id)?.scorePersonal ?? 0
      
      if(userDataA > userDataB){
        return 1;
      }

      if(userDataA < userDataB){
        return -1
      }
      return 0
    })
    return FinalList
  }

  const orderByEpisodesWatched = () => {
    const FinalList = myAnimeList.sort(function (a , b){
      const userDataA = getUserListData(a.id)?.episodesWatched ?? 0
      const userDataB = getUserListData(b.id)?.episodesWatched ?? 0
      
      if(userDataA < userDataB){
        return 1;
      }
      if(userDataA > userDataB){
        return -1
      }
      return 0
    })
    return FinalList
  }

  const listToShow = useMemo(() => {
    let definitiveList: AnimeCardType[] = []

    if (activeCategory === "all"){
      definitiveList = orderByStatus()
    } 

    if(selectedFilter === "Status") definitiveList = orderByStatus()
    if(selectedFilter === "Alphabetical") definitiveList = orderByAlphabetical()
    if(selectedFilter === "Score") definitiveList = orderByScore()
    if(selectedFilter === "Watched Episodes") definitiveList = orderByEpisodesWatched()
    
    if(activeCategory !== "all"){
      definitiveList = myAnimeList.filter( anime => {
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
  }, [myAnimeList, activeCategory, myListMap, searchAnime, selectedFilter]);

  const openAddEditModal = (anime: AnimeCardType) => {
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

        <select className="my-list__selector" onChange={(e) => setSelectedFilter(e.target.value)}>
                {OrderList.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
        </select>

        <div className="my-list__search">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white)" className="size-6 icon-size-m">
            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
          </svg>
          <input type="text" className="my-list__input" onInput={(event: React.InputEvent<HTMLInputElement>) => setSearchAnime(event.currentTarget.value)} placeholder="Search anime..."></input>
        </div>
      </div>
    </div>

    {isLoading ? (
      <LoadingComponent text="Chargin animes..." />
    ) : isError ? (
      <ErrorComponent text="Ha habido un error con la API" />
    ) : listToShow.length === 0 && searchAnime ? (
      <div className="my-list__empty-state__container">
        <h1>(⁠╥⁠﹏⁠╥⁠)</h1>
        <h2>No hay ningun anime llamado asi</h2>
      </div>
    ) : listToShow.length === 0 ? (
      <div className="my-list__empty-state__container">
        <h1>(⁠╥⁠﹏⁠╥⁠)</h1>
        <h2>No hay animes todavia</h2>
        <Link to={"/directory"} className="btn"> Add animes to your list</Link>
      </div>
    )  : (
          <div className="anime-cards__container">
              {listToShow.map((anime: AnimeCardType) =>(
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