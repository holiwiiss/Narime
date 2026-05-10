import { useEffect, useRef, useState } from "react";
import "./search-anime.scss"
import type {
  AnimeSearchResponse,
  AnimeSearchType,
} from "../../services/anime-search/anime-search.type";
import { searchAnime } from "../../services/anime-search/anime-search";
import { data, useNavigate } from "react-router-dom";
import ErrorComponent from "../error/ErrorComponent";
import LoadingComponent from "../loading/LoadingComponent";
import type { AnimeListResponse, AnimeListType } from "../../services/anime-list/anime-list.type";

const SearchAnimeComponent = () => {

  const navigate = useNavigate()

  const [activeSearch, setActiveSearch] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState("");
  const [animeToSearch, setAnimeToSearch] = useState<string>("");
  const [searchList, setSearchList] = useState<AnimeListType[]>([]);
  const timeoutRef = useRef<number | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<string | null>(null)

  useEffect(() => {
    if (!inputValue.trim()) {
      setActiveSearch(false);
      setSearchList([]);
      return;
    }

    const timeout = setTimeout(() => {
      setActiveSearch(true);
      setAnimeToSearch(encodeURIComponent(inputValue));
    }, 500);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  useEffect(() => {
    const fetchAnimes = async () => {
      if(!activeSearch || !animeToSearch) return
      setIsLoading(true)
      setIsError(null)
      try {
        if (activeSearch) {
          const JSON: AnimeListResponse = await searchAnime(animeToSearch, 1, 5);
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

  return (
    <>
    <div className="search__wrapper">
      <input
        type="text"
        className="buscar__anime"
        onInput={(event: React.InputEvent<HTMLInputElement>) =>
          setInputValue(event.currentTarget.value)
        }
        onFocus={(event: React.FocusEvent<HTMLInputElement>) =>
          setActiveSearch(true)}
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
            searchList.map((anime: AnimeListType) => (
              <div key={anime.id} className="anime_search" onClick={() => navigate(`/anime/${anime.id}`)}>
                <img src={anime.image} />
                <p>{anime.title}</p>
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
