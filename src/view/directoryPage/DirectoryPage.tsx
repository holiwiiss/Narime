import { useState, useEffect } from "react";
import "./directorypage.scss";
import type { AnimeListResponse, AnimeListType } from "../../services/anime-list/anime-list.type";
import { getSeasonalAnimes, getTopAnime, getTrendingAnimes } from "../../services/anime-list/anime-list";
import Pagination from "../../components/pagination/Pagination";
import LoadingComponent from "../../components/loading/LoadingComponent";
import ErrorComponent from "../../components/error/ErrorComponent";
import ModalAddEditAnime from "../../components/modalAddEditAnime/ModalAddEditAnime";
import AnimeCard from "../../components/animeCard/AnimeCard";
import { useAnimeModal } from "../../hooks/useAnimeModal";
import { useMyListMap } from "../../hooks/useMyListMap";

const functionMap = {
  top: getTopAnime,
  trending: getTrendingAnimes,
  seasonal: getSeasonalAnimes,
}

const DirectoryPage = () => {

  const  { getUserListData } = useMyListMap()
  const modalAddEdit = useAnimeModal();

  const [animeList, setAnimeList] = useState<AnimeListType[]>([]);

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

  const activateFilter = (category: "top" | "trending" | "seasonal") => {
    setActiveCategory(category);
    setActualPage(1);
  }

  const openAddEditModal = (animeId: number) => {
    const userData = getUserListData(animeId);
    modalAddEdit.openModal(animeId, userData);
  };

  const nextPage = () => {
    if(actualPage >= lastPage) return;
    setActualPage(prev => prev + 1)
  }
  
  const previousPage = () => {
    if(actualPage > 1) setActualPage(prev => prev - 1);
  }

  if (isLoading) return <LoadingComponent text="Cargando animes..." />
  if (isError) return <ErrorComponent text="Ha habido un error con la API" />

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
      </div>

      <Pagination actualPage={actualPage} lastPage={lastPage} onNextPage={nextPage} onPreviousPage={previousPage}></Pagination>
      
      {modalAddEdit.isOpen && modalAddEdit.animeId &&(
        <ModalAddEditAnime
        animeId={modalAddEdit.animeId}
        action={modalAddEdit.action}
        infoDocIdUserAnime = {modalAddEdit.infoDocIdFromUser}
        onClose={modalAddEdit.closeModal}
        />
      )}
    </>
  );
};

export default DirectoryPage;
