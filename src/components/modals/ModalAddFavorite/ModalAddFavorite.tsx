import { useEffect, useState } from "react";
import type { AnimeCardType, AnimeListResponse } from "../../../services/anime-list/anime-list.type";
import { searchAnime } from "../../../services/anime-search/anime-search";
import { addAnimeFavorite } from "../../../firebase/services/user-information.firebase";
import "../modals.scss"
import LoadingComponent from "../../Loading/LoadingComponent";
import { toast } from "sonner";

type PropsModal = {
  listFavoriteId: number[],
  userId:string
  onClose: () => void;
}

export const ModalAddFavorites = ({onClose, listFavoriteId, userId}: PropsModal) => {
  const [inputValue, setInputValue] = useState("");
  const [searchList, setSearchList] = useState<AnimeCardType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    setIsLoading(true)
    setIsError(false)
      if (!inputValue) {
        setSearchList([]);
        setIsLoading(false)
        return;
      }
    
      const timeout = setTimeout(async () => {
        setSearchList([])
        const query = encodeURIComponent(inputValue);
        try {
          const result: AnimeListResponse = await searchAnime(query, 1, 5);
          setSearchList(result.animes);
        } catch (e) {
          setIsError(true)
        }finally{
          setIsLoading(false)
        }
      }, 300);
  
      return () =>{clearTimeout(timeout);} 
    }, [inputValue]);

    const isInList = (animeId:number) =>{
    return listFavoriteId.includes(animeId)
  }

  const addToFavorite = async (animeId: number, userId: string) => {
      try{
        await addAnimeFavorite(animeId, userId)
        toast.success("Anime added to your favorites")
      }catch{
        toast.error("Something went wrong")
      }
    onClose()
  }

  return (
    <>
      <div className="bg-popup">
        <div className="surface popup__container popup_ad">
          <h3 className="text-h2">Add to favorites</h3>
          <input
            className="text-p input"
            type="text"
            value={inputValue}
            onInput={(event: React.InputEvent<HTMLInputElement>) =>
              setInputValue(event.currentTarget.value)
            }
            placeholder="Search an anime..."
          ></input>
          <div className="container-info-favorites">
            {isLoading ? (
              <LoadingComponent size="small"/>
            ) : isError ? (
              <h1 className="text-h2 text-color--75" >Something went wrong</h1>
            ) : inputValue==="" && searchList.length === 0 ? (
              <p className="text-p text-color--75">Start searching</p>
            ) : searchList.length === 0 ? (
              <p className="text-p text-color--75">Not found anime</p>
            ) : (
              searchList.map((anime: AnimeCardType) =>
                !isInList(anime.id) ? (
                  <div key={anime.id} className="anime-favorite__card">
                    <div className="anime-favorite__card-header">
                    <img
                      className="anime-search__card-img"
                      src={anime.image}
                    />
                    <p className="text-p anime-search__card-tittle">{anime.title}</p>
                    </div>
                    <button
                      className="btn"
                      onClick={() => addToFavorite(anime.id, userId)}
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <div key={anime.id} className="anime-favorite__card">
                    <div className="anime-favorite__card-header">
                    <img
                      className="anime-search__card-img"
                      src={anime.image}
                    />
                    <p className="text-p anime-search__card-tittle">{anime.title}</p>
                    </div>
                    <span className="text-details text-color--75">Already in your favorites</span>
                  </div>
                ),
              )
            )}
          </div>

          <button
            className="btn btn--secondary"
            onClick={onClose}
          >
            Close{" "}
          </button>
        </div>
      </div>
    </>
  );
};
