import { useEffect, useState } from "react";
import "./modals.scss"
import { useForm, Controller , type SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import type { AnimePersonalStatusType, UserAnimeEditDataType } from "../../firebase/services/firestore-service.type";
import { useAuth } from "../../context/auth-context";
import OptionsPopUp from "../options-pop-up/options-pop-up";

import StarRating from "../ui/star-rating/star-rating";
import EpisodesInput from "../ui/episodes-input/episodes-input";
import { useMyAnimeList } from "../../context/my-list-context";
import IconDots from "../ui/icons/icon-dots";
import StatusSelector from "../ui/status-selector/status-selector";

type PropsModal = {
  animeId: number;
  totalEpisodes: number;
  animeTitle: string;
  action: "add" | "edit";
  infoDocIdUserAnime: UserAnimeEditDataType | null;
  onClose: () => void;
}

export interface PopUpFormInputs {
  animeId:number, 
  status: AnimePersonalStatusType, 
  score: number | null, 
  episodes: number
}

const ModalAddEditAnime = ({animeId, totalEpisodes, animeTitle, action, infoDocIdUserAnime, onClose} :PropsModal) => {

  const { user } = useAuth()
  const { addAnimeToMyList, editAnimeToMyList, deleteAnimeToMyList } = useMyAnimeList()
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const {
    handleSubmit,
    watch,
    reset,
    control,
  } = useForm<PopUpFormInputs>({
    defaultValues: {
      animeId,
      status: "watching",
      score: null,
      episodes: 1,
    }
  });
  
  const onSubmit: SubmitHandler<PopUpFormInputs> = (data) => {
    sendAction(data)
  }

  useEffect(() => {
    if (action === "edit" && infoDocIdUserAnime) {
      reset({
        animeId,
        status: infoDocIdUserAnime.status,
        score: infoDocIdUserAnime.score,
        episodes: infoDocIdUserAnime.episodes,
      });
    }

  }, [action, infoDocIdUserAnime, animeId, reset])
  
  const statusValue = watch("status");

  const sendAction = (data:PopUpFormInputs) =>{
    if(data.status === "completed") data.episodes = totalEpisodes
    if(data.status === "planToWatch") data.episodes = 1

    if(action === "add"){
      addAnimeToMyList(animeId, animeTitle, data.status, data.score, data.episodes);
    } else {
      if(!infoDocIdUserAnime) return
      editAnimeToMyList(infoDocIdUserAnime?.docId, data.status, data.score, data.episodes)
    }
    onClose();
  }

  const deleteAnime = () => {
    if(!infoDocIdUserAnime) return
    deleteAnimeToMyList(infoDocIdUserAnime?.docId)
    onClose();
  }

  return (
    <div className="bg-popup">
      <div className="surface popup__container">
        {!user ? (
          <>
            <h2 className="text-h2">You're not logged in</h2>
            <p className="text-p text-color--75">Sign in to start saving your progress</p>
            <Link to="/login" className="bton">Sign in</Link>
          </>
        ):(
          <>
            <div className="popUp__container--header">
              <div className="popUp__container-header--title">
                <p className="text-p text-color--75">{action === "add" ? "Adding to my list" : "Editing"}</p>
                <h3 className="text-h2">{animeTitle}</h3>
              </div>
              {action==="edit" && (
                <>
                <button className="icon-options-pop-up" onClick={() => setIsOptionsOpen(true)}>
                  <IconDots className="icon-size-m"/>
                </button>
                {isOptionsOpen && (<OptionsPopUp isOpen={isOptionsOpen} onClose={()=> setIsOptionsOpen(false)} onDelete={deleteAnime}/>)}
                </>
              )}
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="form"> 
              <div className="form__group">
                <label htmlFor="status-selector" className="text-details">Status</label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <StatusSelector
                      id="status-selector"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              {statusValue !=="planToWatch" && ( 
                <div className="form__group">     
                <label htmlFor="score-value" className="text-details">Personal Score</label>
                <Controller
                  name="score"
                  control={control}
                  render={({ field }) => (
                    <StarRating
                      id="score-selector"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div> )}

              {(statusValue === "watching" || statusValue === "dropped") && (
                <div className="form__group">
                  <label htmlFor="episodes-selector" className="text-details">Episodes</label>
                  <div className="episodes-row">
                  <Controller
                    name="episodes"
                    control={control}
                    render={({ field }) => (
                      <EpisodesInput
                        id="episodes-selector"
                        value={field.value}
                        onChange={field.onChange}
                        max={totalEpisodes}
                      />
                    )}
                  />
                  <p className="text-details text-color--75"> / {totalEpisodes} episodes</p>
                  </div>
                </div>
              )}
              <div className=" form__group btn--popup-container">
                <button type="submit" className="btn">Save</button>
                <button type="button" className="btn btn--secondary" onClick={onClose}>Close</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalAddEditAnime;
