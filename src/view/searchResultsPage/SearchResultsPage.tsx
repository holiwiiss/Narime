import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { AnimeSearchType, AnimeSearchResponse } from "../../services/anime-search/anime-search.type";
import { searchAnime } from "../../services/anime-search/anime-search";
import Pagination from "../../components/pagination/Pagination";
import LoadingComponent from "../../components/loading/LoadingComponent";
import ErrorComponent from "../../components/error/ErrorComponent";

const SearchResultsPage = () => {

  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const navigate = useNavigate()

  const [searchList, setSearchList] = useState<AnimeSearchType[]>([]);
  const [actualPage, setActualPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(1)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnimes = async () => {
      setIsLoading(true)
      setIsError(null)
      if(!query){
        return setIsError('No hay ninguna búsqueda con coincida con el resultado')
      }
      try{
        const JSON: AnimeSearchResponse = await searchAnime(query,actualPage, 25)
        setSearchList(JSON.animes);
        setLastPage(JSON.pagination.last_visible_page)
      }catch(e){
        console.log("La api no responde, " + e);
        setIsError('Ha habido un error con la carga de la API')
      }
      finally{
        setIsLoading(true)
      }
    }
    fetchAnimes();
  })

  if (isLoading) return <LoadingComponent text="Cargando datos del anime..." />
  if (isError) return <ErrorComponent text={isError} />

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
