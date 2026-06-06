import { useState } from "react";
import type { AnimeCardType} from "../../services/anime-list/anime-list.type";
import { addAnimeFavorite } from "../../firebase/services/user-information.firebase";
import "./modals.scss"
import LoadingComponent from "../loading-component/loading-component";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "../../hooks/use-debounce";
import { useAnimeSearch } from "../../hooks/use-anime-search";

type PropsModal = {
  listFavoriteId: number[],
  userId:string
  onClose: () => void;
}

export const ModalAddFavorites = ({onClose, listFavoriteId, userId}: PropsModal) => {
  const [inputValue, setInputValue] = useState("");
  const queryClient = useQueryClient()
  const debounceInput = useDebounce(inputValue, 300)
  const { isLoading, isError, searchList } = useAnimeSearch(debounceInput)
  
  const isInList = (animeId:number) =>{
    return listFavoriteId.includes(animeId)
  }

  const addToFavorite = async (animeId: number) => {
      try{
        await addAnimeFavorite(animeId, userId)
        queryClient.invalidateQueries({ queryKey: ["userData"] })
        queryClient.invalidateQueries({ queryKey: ["myFavoriteList"] }) 
        toast.success("Anime added to your favorites")
        onClose()
      }catch{
        toast.error("Something went wrong")
      }
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
              <>
                {searchList.map((anime: AnimeCardType) => (
                  <div key={anime.id} className="anime-favorite__card">
                    <div className="anime-favorite__card-header">
                      <img className="anime-search__card-img" src={anime.image} alt={anime.title} />
                      <p className="text-p anime-search__card-tittle">{anime.title}</p>
                    </div>
                    {isInList(anime.id) ? (
                      <span className="text-details text-color--75">Already in your favorites</span>
                    ) : (
                      <button className="btn" onClick={() => addToFavorite(anime.id)}>Add</button>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          <button
            className="btn btn--secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};
