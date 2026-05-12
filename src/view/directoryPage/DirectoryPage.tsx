import { useState, useEffect } from "react";
import "./directorypage.scss";
import type { AnimeListResponse, AnimeCardType } from "../../services/anime-list/anime-list.type";
import { getSeasonalAnimes, getTopAnime, getTrendingAnimes } from "../../services/anime-list/anime-list";
import LoadingComponent from "../../components/loading/LoadingComponent";
import ErrorComponent from "../../components/error/ErrorComponent";
import ModalAddEditAnime from "../../components/modalAddEditAnime/ModalAddEditAnime";
import AnimeCard from "../../components/animeCard/AnimeCard";
import { useAnimeModal } from "../../hooks/useAnimeModal";
import { useMyListMap } from "../../hooks/useMyListMap";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/pagination/Pagination";

const functionMap = {
  top: getTopAnime,
  trending: getTrendingAnimes,
  seasonal: getSeasonalAnimes,
}
/*type CategoryType = "top" | "trending" | "seasonal";*/

const DirectoryPage = () => {

  const  { getUserListData } = useMyListMap()
  const modalAddEdit = useAnimeModal();

  const [animeList, setAnimeList] = useState<AnimeCardType[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const [activeCategory, setActiveCategory] = useState <"top" | "trending" | "seasonal">("top")
  const [actualPage, setActualPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(1)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    const fetchAnimes= async () => {
      setIsLoading(true)
      setIsError(false)
      console.log(searchParams)
      try{
        setSearchParams({category: activeCategory, page: String(actualPage)})
        const searchFunction = functionMap[activeCategory]
        const data: AnimeListResponse = await searchFunction(actualPage)
        setAnimeList((prevAnimes) => prevAnimes.concat(data.animes))
        setLastPage(data.pagination.lastVisiblePage);
      }catch(e){
        console.log('La api no responde, ' + e)
        setIsError(true)
      }finally {
        setIsLoading(false)
      }
    };
    fetchAnimes();
  }, [activeCategory, actualPage]);

  const activateFilter = (category: "top" | "trending" | "seasonal") => {
    setActiveCategory(category);
    setActualPage(1);
    setAnimeList([])
  }

  const openAddEditModal = (anime: AnimeCardType) => {
    const userData = getUserListData(anime.id);
    modalAddEdit.openModal(anime.id, anime.episodes, userData);
  };

  const nextPage = () => {
    if(actualPage >= lastPage) return;
    setActualPage(prev => prev + 1)
  }
  
  const previousPage = () => {
    if(actualPage > 1) setActualPage(prev => prev - 1);
  }

  return (
    <>
    <div className="directory__options">
      <div className="directory__options-buttons">
        <button className={`btn ${activeCategory === 'top' ? "" : "btn--disable"}`}  onClick={() => activateFilter("top")}>TOP ANIMES</button>
        <button className={`btn ${activeCategory === 'trending' ? "" : "btn--disable"}`} onClick={() => activateFilter("trending")}>TRENDING</button>
        <button className={`btn ${activeCategory === 'seasonal' ? "" : "btn--disable"}`} onClick={() => activateFilter("seasonal")}>SEASONAL</button>
      </div>
    </div>

    {animeList.length > 0 ? (
      <>
      <div className="anime-cards__container">
        {animeList.map((anime: AnimeCardType) => (
          <AnimeCard
            key={anime.id}
            anime={anime}
            userData={getUserListData(anime.id)}
            onOpenModal={() => openAddEditModal(anime)}
          />
        ))}
      </div>
      <button className="btn" onClick={() => setActualPage(actualPage +1)}>Cargar más usuarios</button>
      /*<Pagination actualPage={actualPage} lastPage={lastPage} onNextPage={nextPage} onPreviousPage={previousPage}></Pagination>*/
      </>
    ): isLoading ? (
      <LoadingComponent text="Cargando animes..." />
    ): isError ? (
      <ErrorComponent text="Ha habido un error con la API" />
    ) : animeList.length === 0 ? (
      <h1>(⁠╥⁠﹏⁠╥⁠)</h1>
    ) : (
      <h1>hola</h1>
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
  );
};

export default DirectoryPage;
