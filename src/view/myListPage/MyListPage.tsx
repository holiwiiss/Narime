import { useMemo, useState } from "react";
import type { AnimePersonalStatusType } from "../../firebase/services/firestore-service.type";
import { useAnimeModal } from "../../hooks/useAnimeModal";
import { useMyAnimeList } from "../../context/MyListContext";
import type { AnimeCardType } from "../../services/anime-list/anime-list.type";
import AnimeCard from "../../components/AnimeCard/AnimeCard";
import { useMyListMap } from "../../hooks/useMyListMap";
import "./myListPage.scss"
import LoadingComponent from "../../components/loading/LoadingComponent";
import ErrorComponent from "../../components/error/ErrorComponent";
import { useQuery } from "@tanstack/react-query";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import { fetchMyList } from "../../queries/my-list-information";
import ModalAddEditAnime from "../../components/modals/ModalAddEditAnime/ModalAddEditAnime";

const MyListPage = () =>{

  const { myList } = useMyAnimeList()
  const  { myListMap, getUserListData } = useMyListMap()
  const modalAddEdit= useAnimeModal()

  const OrderList = ["Status", "Alphabetical", "Score", "Watched Episodes", "Last Updated"]
  const [activeCategory, setActiveCategory] = useState <"all" | AnimePersonalStatusType>("all");
  const [searchAnime, setSearchAnime] = useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = useState("");

  const {isLoading, isError, data} = useQuery({
    queryKey:["myAnimeList", myList.map((a:any) => a.animeId)], // useQuery compara el key para saber si relanzar la query
    queryFn: () => fetchMyList(myList),
    enabled: myList.length > 0,
  })

  const myAnimeList: AnimeCardType[] = data ?? []

  const orderByStatus = () => {
    const watchingList = myAnimeList.filter((anime:any) => {
        const userData = getUserListData(anime.id)
        if(userData?.statusPersonal === "watching") return true
      })

      const completedList = myAnimeList.filter((anime:any) => {
        const userData = getUserListData(anime.id)
        if(userData?.statusPersonal === "completed") return true
      })

      const droppedList = myAnimeList.filter((anime:any) => {
        const userData = getUserListData(anime.id)
        if(userData?.statusPersonal === "dropped") return true
      })

      const planList =  myAnimeList.filter((anime:any) => {
        const userData = getUserListData(anime.id)
        if(userData?.statusPersonal === "planToWatch") return true
      })

      const finalList = [...watchingList, ...completedList, ...droppedList, ...planList]
      return finalList
  }

  const orderByAlphabetical = () => {
    const FinalList = myAnimeList.sort(function (a:any, b:any){
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
    const FinalList = myAnimeList.sort(function (a:any, b:any){
      const userDataA = getUserListData(a.id)?.scorePersonal ?? 0
      const userDataB = getUserListData(b.id)?.scorePersonal ?? 0
      
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
        if(title.includes(search)) return true
      })
    }
    return definitiveList
  }, [myAnimeList, activeCategory, myListMap, searchAnime, selectedFilter]);

  const openAddEditModal = (anime: AnimeCardType) => {
    const userData = myListMap.get(anime.id);
    modalAddEdit.openModal(anime.id, anime.episodes,  anime.title, userData);
  }

return(
  <>
  <div className="content-max">
    <div className="my-list__options tab__container my-list__options-real">
      <div className="tab__buttons tab__buttons--my-list">
        <button className={`text-p tab-option ${activeCategory === 'all' ? "tab-option__selected" : "tab-option__unselected"}`} onClick={() => setActiveCategory("all")}>All</button>
        <button className={`text-p tab-option ${activeCategory === 'watching' ? "tab-option__selected" : "tab-option__unselected"}`} onClick={() => setActiveCategory("watching")}>Watching</button>
        <button className={`text-p tab-option ${activeCategory === 'completed' ? "tab-option__selected" : "tab-option__unselected"}`} onClick={() => setActiveCategory("completed")}>Completed</button>
        <button className={`text-p tab-option ${activeCategory === 'dropped' ? "tab-option__selected" : "tab-option__unselected"}`} onClick={() => setActiveCategory("dropped")}>Dropped</button>
        <button className={`text-p tab-option ${activeCategory === 'planToWatch' ? "tab-option__selected" : "tab-option__unselected"}`} onClick={() => setActiveCategory("planToWatch")}>Plan to watch</button>
      </div>
      <div className="my-list__filters">

      <CustomSelect
          options={OrderList}
          value={selectedFilter}
          onChange={setSelectedFilter}
          onReset={() => setSelectedFilter("")}
          firstValue="Order by"
          containerWidth="225px"
        />

        <div className="action-item input">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white)" className="size-6 action-item__icon ">
            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
          </svg>
          <input type="text" className="text-p my-list__input" onInput={(event: React.InputEvent<HTMLInputElement>) => setSearchAnime(event.currentTarget.value)} placeholder="Search anime..."></input>
        </div>
      </div>
    </div>

    {isLoading ? (
      <LoadingComponent/>
    ) : isError ? (
      <ErrorComponent text="Something went wrong" button={{ label: "Try again", action:{ type: "reload" }}} />
    ) : listToShow.length === 0 && searchAnime ? (
      <ErrorComponent text="No anime found with that name"/>
    ) : listToShow.length === 0 ? (
      <ErrorComponent text="No anime yet" button={{ label: "Add animes to your list", action: { type: "navigate", href: "/" } }} />
    ) : (
          <ul className="cards__grid">
              {listToShow.map((anime: AnimeCardType) =>(
                <AnimeCard
                  key={anime.id}
                  anime={anime}
                  userData={getUserListData(anime.id)}
                  onOpenModal={() => openAddEditModal(anime)}
                  variant = "mylist"
                  fromState={{ from: "/my-list", label: "My List" }}
                >
                </AnimeCard>
              ))}
            </ul>
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
    </div>
  </>
)
}

export default MyListPage;