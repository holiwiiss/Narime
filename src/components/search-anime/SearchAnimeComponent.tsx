import { useEffect, useRef, useState } from "react";
import "./search-anime.scss"
import type {
  AnimeSearchResponse,
  AnimeSearchType,
} from "../../services/anime-search/anime-search.type";
import { searchAnime } from "../../services/anime-search/anime-search";
import { useNavigate } from "react-router-dom";
import ErrorComponent from "../error/ErrorComponent";
import LoadingComponent from "../loading/LoadingComponent";

const SearchAnimeComponent = () => {

  const navigate = useNavigate()

  const [activeSearch, setActiveSearch] = useState<boolean>(false);
  const [animeToSearch, setAnimeToSeach] = useState<string>("");
  const [searchList, setSearchList] = useState<AnimeSearchType[]>([]);
  const timeoutRef = useRef<number | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnimes = async () => {
      setIsError(null)
      try {
        if (activeSearch) {
          setIsLoading(true)
          const JSON: AnimeSearchResponse = await searchAnime(animeToSearch, 1, 5);
          setSearchList(JSON.animes);
          setTotalItems(JSON.pagination.total_items);
        }
      } catch (e) {
        console.log("La api no responde, " + e);
        setIsError('Ha habido un error con la carga de la API');
      }finally{
        setIsLoading(false)
      }
    };
    fetchAnimes();
  }, [activeSearch, animeToSearch]);

  if (isLoading) return <LoadingComponent text="Cargando datos del anime..." />
  if (isError) return <ErrorComponent text={isError} />

  const handleSearch = (text: string) => {
    console.log(text);

    if (!text || text==="") {
      setActiveSearch(false);
      setSearchList([]);
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setActiveSearch(true);
      const encodedQuery = encodeURIComponent(text);
      setAnimeToSeach(encodedQuery);
    }, 500);
  };

  return (
    <>
    <div className="search__wrapper">
      <input
        type="text"
        className="buscar__anime"
        onInput={(event: React.InputEvent<HTMLInputElement>) =>
          handleSearch(event.currentTarget.value)
        }
        onFocus={(event: React.FocusEvent<HTMLInputElement>) =>
          handleSearch(event.currentTarget.value)}
        onBlur={() => {
          setTimeout(() => setActiveSearch(false), 200);
        }}
        placeholder="Search an anime..."
      ></input>

      {activeSearch && (
        <div className="all_busquedas__container">
          {searchList.length === 0 ? (
            <p>no se ha encontrado ningún anime con ese nombre</p>
          ) : (
            searchList.map((anime: AnimeSearchType) => (
              <div className="anime_search" onClick={() => navigate(`/anime/${anime.id}`)}>
                <img src={anime.image} />
                <p>{anime.title}</p>
                <p>{anime.type}</p>
              </div>
            ))
          )}
          <button onClick={() => navigate(`/search/anime?q=${animeToSearch}`)}> View More ({totalItems})</button>
        </div>
      )}
      </div>
    </>
  );
};

export default SearchAnimeComponent;
