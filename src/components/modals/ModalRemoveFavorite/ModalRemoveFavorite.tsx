import { toast } from "sonner";
import { removeAnimeFavorite } from "../../../firebase/services/user-information.firebase";
import type { AnimeCardType } from "../../../services/anime-list/anime-list.type";
import { useQueryClient } from "@tanstack/react-query";

type PropsModal = {
  listFavoriteInformation: AnimeCardType[];
  userId: string;
  onClose: () => void;
};

export const ModalRemoveFavorites = ({listFavoriteInformation, userId, onClose}:PropsModal) => {
  const queryClient = useQueryClient()

  const deleteToFavorite = async (animeId: number, userId: string) => {
      try{
        await removeAnimeFavorite(animeId, userId)
        queryClient.invalidateQueries({ queryKey: ["userData"] })
        queryClient.invalidateQueries({ queryKey: ["myFavoriteList"] })
        toast.success("Anime remove from your favorites")
      }catch{
        toast.error("Something went wrong")
      }
      onClose()
    }

  return (
    <div className="bg-popup">
      <div className="surface popup__container ">
        <h3 className="text-h2">Edit your favorites</h3>
        <div>
          {listFavoriteInformation.map((anime: AnimeCardType) => (
            <div key={anime.id} className="anime-favorite__card">
              <div className="anime-favorite__card-header">
              <img className="anime-search__card-img" src={anime.image} />
              <p className="text-p anime-search__card-tittle">{anime.title}</p>
              </div>
              <button
                className="btn"
                onClick={() => deleteToFavorite(anime.id, userId)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          className="btn btn--secondary"
          onClick={onClose}
        >
          Close{" "}
        </button>
      </div>
    </div>
  );
};
