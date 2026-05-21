import { useEffect, useRef, useState } from "react";
import "./search-anime.scss"
import { searchAnime } from "../../services/anime-search/anime-search";
import { useNavigate } from "react-router-dom";
import ErrorComponent from "../error/ErrorComponent";
import LoadingComponent from "../loading/LoadingComponent";
import type { AnimeListResponse, AnimeCardType } from "../../services/anime-list/anime-list.type";

type Props = {
  isOpen?: boolean;
  onClose?: () => void;
};

const SearchAnimeComponent = ({ isOpen, onClose }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);


  const navigate = useNavigate()
  const wrapperRef = useRef<HTMLDivElement | null >(null)

  const [activeSearch, setActiveSearch] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState("");
  const [animeToSearch, setAnimeToSearch] = useState<string>("");
  const [searchList, setSearchList] = useState<AnimeCardType[]>([]);
  
  const [totalItems, setTotalItems] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<string | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setActiveSearch(false);
        setInputValue("")
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (!inputValue) {
      setActiveSearch(false);
      setSearchList([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setActiveSearch(true);
      const query = encodeURIComponent(inputValue);
      setAnimeToSearch(query);
      setIsLoading(true);
      setIsError(null);

      try {
        const result: AnimeListResponse = await searchAnime(query, 1, 5);
        setSearchList(result.animes);
        setTotalItems(result.pagination.totalItems);
      } catch (e) {
        console.log("La api no responde, " + e);
        setIsError('Ha habido un error con la carga de la API');
      }finally{
        setIsLoading(false)
      }

    }, 300);

    return () =>{clearTimeout(timeout);} 
  }, [inputValue]);

  return (
    <>
    <div className={`search-input-wrap ${isOpen ? 'open' : ''}`} ref={wrapperRef}>
      <input
        ref={inputRef}
        type="text"
        className="buscar__anime"
        value={inputValue}
        onInput={(event: React.InputEvent<HTMLInputElement>) =>
          setInputValue(event.currentTarget.value)
        }
        onFocus={() => inputValue && setActiveSearch(true)}
        placeholder="Search an anime..."
      ></input>

      {activeSearch && (
        <div className="all-search__content">
          {isLoading ? (
            <LoadingComponent text="Charging anime data..." />
          ) : isError ? (
            <ErrorComponent text={isError} />
          ): searchList.length === 0 ? (
            <p>no se ha encontrado ningún anime con ese nombre</p>
          ) : (
            searchList.map((anime: AnimeCardType) => (
              <div key={anime.id} className="anime-search__card" onClick={() => navigate(`/anime/${anime.id}`)}>
                <img className="anime-search__card-img" src={anime.image} />
                <p>{anime.title}</p>
              </div>
            ))
          )}
          <button className="btn btn--small btn-search-more" onClick={() => navigate(`/search/anime?q=${animeToSearch}`)}> View More ({totalItems})</button>
        </div>
      )}
      </div>
    </>
  );
};

export default SearchAnimeComponent;
