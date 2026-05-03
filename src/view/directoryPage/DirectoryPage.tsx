import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./directorypage.scss";
import type { AnimeListResponse, AnimeListType } from "../../services/anime-list/anime-list.type";
import { getSeasonalAnimes, getTopAnime, getTrendingAnimes } from "../../services/anime-list/anime-list";
import Pagination from "../../components/pagination/Pagination";
import LoadingComponent from "../../components/loading/LoadingComponent";
import ErrorComponent from "../../components/error/ErrorComponent";
import ModalAddEditAnime from "../../components/modalAddEditAnime/ModalAddEditAnime";
import { useAuth } from "../../context/AuthContext";
import { getAllAnimesFirebase } from "../../firebase/services/firestoreService";
import type { UserAnimeListFirestoreType } from "../../firebase/services/firestoreService.type";

const functionMap = {
  top: getTopAnime,
  trending: getTrendingAnimes,
  seasonal: getSeasonalAnimes,
}

const DirectoryPage = () => {

  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAnimeId, setSelectedAnimeId] = useState <number | null> (null)
  const [selectedAction, setSelectedAction] = useState<"add" | "edit"> ("add")

  const [animeList, setAnimeList] = useState<AnimeListType[]>([]);
  const [animesWatched, setAnimesWatched] = useState <UserAnimeListFirestoreType[]>([]);

  const [activeCategory, setActiveCategory] = useState <"top" | "trending" | "seasonal">("top")
  const [actualPage, setActualPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(1)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    const fetchAnimes= async () => {
      setIsLoading(true)
      setIsError(false)
      try{

        if(user){
          setAnimesWatched(await getAllAnimesFirebase(user?.uid))
        }
        
        const searchFunction = functionMap[activeCategory]
        const data: AnimeListResponse = await searchFunction(actualPage)
        setAnimeList(data.animes);
        setLastPage(data.pagination.last_visible_page);
      }catch(e){
        console.log('La api no responde, ' + e)
        setIsError(true)
      }finally {
        setIsLoading(false)
      }
    };
    fetchAnimes();
  }, [activeCategory, actualPage]);

  if (isLoading) return <LoadingComponent text="Cargando animes..." />
  if (isError) return <ErrorComponent text="Ha habido un error con la API" />

  const activateFilter = (category: "top" | "trending" | "seasonal") => {
    setActiveCategory(category);
    setActualPage(1);
  }

  const openAddModal = (e: React.MouseEvent<HTMLButtonElement>, animeId:number, action:"add" | "edit") => {
    e.stopPropagation();
    setSelectedAnimeId(animeId)
    setIsModalOpen(true)
    setSelectedAction(action)
  }

  const nextPage = () => {
    if(actualPage >= lastPage) {
      return;
    }
    setActualPage(prev => prev + 1)
  }
  
  const previousPage = () => {
    if(actualPage > 1){
      setActualPage(prev => prev - 1);
    }
  }

  const getAnimeUserInformation = (jikanAnimeID: number) => {
    return animesWatched.find( (anime: UserAnimeListFirestoreType) => anime.animeId === jikanAnimeID);
  }

  return (
    <>
    <div className="bton__container">
      <button className={activeCategory === 'trending' ? "bton btn__able" : " bton btn__disable "} onClick={() => activateFilter("trending")}>Trending</button>
      <button className={activeCategory === 'top' ? "bton btn__able" : " bton btn__disable"} onClick={() => activateFilter("top")}>Top 100</button>
      <button className={activeCategory === 'seasonal' ? "bton btn__able" : " bton btn__disable"} onClick={() => activateFilter("seasonal")}>Seasonal</button>
    </div>

    <div className="cards__container">
      {animeList.length === 0 ? (
        <h1>No se han encontrado animes</h1>
      ) : (
        animeList.map((anime: AnimeListType) => {
          const userData = getAnimeUserInformation(anime.id)
          return (
            <div key={anime.id} className="anime__card" onClick={() => navigate(`/anime/${anime.id}`)}>
              <h1>{anime.title}</h1>
              <img src={anime.image}/>
              <div className="information__container">
                <h2>Score: {anime.score}</h2>
                <h2>Episodes: {anime.episodes}</h2>
              </div>
              {userData && (
                <div className="mylist__info">
                  <p>My status: {userData.statusPersonal}</p>
                  <p>My score: {userData.scorePersonal}</p>
                  <p>episodes Watched: {userData.episodesWatched}</p>
                </div>
              )}
              <button onClick={(e) => openAddModal(e, anime.id, "add")}>{userData ? "Edit" : "Add to list"}</button>
            </div>
          )})
      )}
      </div>

      <Pagination actualPage={actualPage} lastPage={lastPage} onNextPage={nextPage} onPreviousPage={previousPage}></Pagination>
      {isModalOpen && selectedAnimeId && (
        <ModalAddEditAnime
        animeId={selectedAnimeId}
        action={selectedAction}
        onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default DirectoryPage;
