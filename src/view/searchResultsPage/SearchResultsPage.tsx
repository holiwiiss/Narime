import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchAnime } from "../../services/anime-search/anime-search";
import Pagination from "../../components/pagination/Pagination";
import { useMyListMap } from "../../hooks/useMyListMap";
import AnimeCard from "../../components/animeCard/AnimeCard";
import type { AnimeListResponse, AnimeCardType } from "../../services/anime-list/anime-list.type";
import ModalAddEditAnime from "../../components/modalAddEditAnime/ModalAddEditAnime";
import { useAnimeModal } from "../../hooks/useAnimeModal";

const SearchResultsPage = () => {

  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  
  const modalAddEdit = useAnimeModal();
  const  { getUserListData } = useMyListMap()

  const [searchList, setSearchList] = useState<AnimeCardType[]>([]);
  const [actualPage, setActualPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(1)


  useEffect(() => {
    const fetchAnimes = async () => {
      if(!query){
        return console.log('No hay ninguna búsqueda con coincida con el resultado')
      }
      try{
        const JSON: AnimeListResponse = await searchAnime(query,actualPage, 25)
        setSearchList(JSON.animes);
        setLastPage(JSON.pagination.lastVisiblePage)
      }catch(e){
        console.log("La api no responde, " + e);
        console.log('Ha habido un error con la carga de la API')
      }
      finally{
      }
    }
    fetchAnimes();
  })

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

  const openAddEditModal = (anime: AnimeCardType) => {
    const userData = getUserListData(anime.id);
    modalAddEdit.openModal(anime.id, anime.episodes, userData);
  };


  return (
    <>
      <h1>Aqui tienes los resultados de tu búsqueda</h1>

      <div className="cards__container">
        {searchList.length === 0 ? (
              <p>no se ha encontrado ningún anime con ese nombre</p>
            ) : (
              searchList.map((anime: AnimeCardType) => {
                return (
                  <AnimeCard
                    key={anime.id}
                    anime={anime}
                    userData={getUserListData(anime.id)}
                    onOpenModal={() => openAddEditModal(anime)}
                  >
                  </AnimeCard>
                )
              })
            )
        }
      </div>
      
      <Pagination actualPage={actualPage} lastPage={lastPage} onNextPage={nextPage} onPreviousPage={previousPage}></Pagination>

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

export default SearchResultsPage;
