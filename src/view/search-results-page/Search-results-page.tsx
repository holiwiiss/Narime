import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { AnimeSearchType, AnimeSearchResponse } from "../../services/anime-search/anime-search.type";
import { searchAnime } from "../../services/anime-search/anime-search";
import Pagination from "../../components/pagination/Pagination";

const SearchResultsPage = () => {

  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const navigate = useNavigate()

  const [searchList, setSearchList] = useState<AnimeSearchType[]>([]);
  const [actualPage, setActualPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(1)

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

  useEffect(() => {
    const fetchAnimes = async () => {
      if(!query){
        return <h1>No hay resultados que coincidan con esta búsqueda</h1>
      }
      try{
        const JSON: AnimeSearchResponse = await searchAnime(query,actualPage, 25)
        setSearchList(JSON.animes);
        setLastPage(JSON.pagination.last_visible_page)
      }catch(err){
        console.log("La api no responde, " + err);
      }
    }
    fetchAnimes();
  })

  return (
    <>
      <h1>Aqui tienes los resultados de tu búsqueda</h1>

      <div className="cards__container">
        {searchList.length === 0 ? (
              <p>no se ha encontrado ningún anime con ese nombre</p>
            ) : (
              searchList.map((anime: AnimeSearchType) => (
                <div className="anime__card" onClick={() => navigate(`/anime/${anime.id}`)}>
                  <h1>{anime.title}</h1>
                  <img src={anime.image}/>
                  <div className="information__container">
                  <h2>Score: {anime.score}</h2>
                  <h2>Episodes: {anime.episodes}</h2>
                </div>
              <button> Add to list</button>
            </div>
              ))
            )
        }
      </div>
      
      <Pagination actualPage={actualPage} lastPage={lastPage} onNextPage={nextPage} onPreviousPage={previousPage}></Pagination>
    </>
  );
};

export default SearchResultsPage;
