import { useEffect, useRef, useState } from "react";
import "./modals.scss"
import { useForm, useWatch, Controller} from "react-hook-form";
import { Link } from "react-router-dom";
import type { AnimePersonalStatusType, UserAnimeEditDataType } from "../../firebase/services/firestore-service.type";

import OptionsPopUp from "../options-pop-up/options-pop-up";
import StarRating from "../ui/star-rating/star-rating";
import EpisodesInput from "../ui/episodes-input/episodes-input";

import IconDots from "../ui/icons/icon-dots";
import StatusSelector from "../ui/status-selector/status-selector";
import { useAuth } from "../../hooks/use-auth";
import { useMyAnimeList } from "../../hooks/use-my-list";
import { calculateWidth } from "../../utils/calculate-width";

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
  const prevStatusRef = useRef<AnimePersonalStatusType | null>(null)
  
  const {
    handleSubmit,
    reset,
    control,
    setValue
  } = useForm<PopUpFormInputs>({
    defaultValues: {
      animeId,
      status: "watching",
      score: null,
      episodes: 1,
    }
  });

  const statusValue = useWatch({ control, name: "status" })
  const episodesValue = useWatch({ control, name: "episodes" }) 
  
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

  useEffect(() => {
    if (
      totalEpisodes > 0 &&
      episodesValue === totalEpisodes &&
      statusValue === "watching" &&
      prevStatusRef.current === "watching"
    ) {
      setValue("status", "completed")
    }
  }, [episodesValue, totalEpisodes, statusValue, setValue])

  useEffect(() => {
    if (prevStatusRef.current === "completed" && statusValue === "watching") {
      setValue("episodes", 1)
    }
    if (prevStatusRef.current !== "completed" && statusValue === "completed" && totalEpisodes > 0) {
      setValue("episodes", totalEpisodes)
    }
    prevStatusRef.current = statusValue
  }, [statusValue])

  const sendAction = async (data:PopUpFormInputs) =>{
    if(data.status === "completed") data.episodes = totalEpisodes
    if(data.status === "planToWatch") data.episodes = 1

    if(action === "add"){
      await addAnimeToMyList(animeId, animeTitle, data.status, data.score, data.episodes);
    } else {
      if(!infoDocIdUserAnime) return
      await editAnimeToMyList(infoDocIdUserAnime.docId, data.status, data.score, data.episodes)
    }
    onClose();
  }

  const deleteAnime = async () => {
    if(!infoDocIdUserAnime) return
    await deleteAnimeToMyList(infoDocIdUserAnime.docId)
    onClose();
  }

  return (
    <div role="presentation" className="bg-popup">
        {!user ? (
          <div role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title" 
            className="surface popup__container"
          >
            <div role="dialog" aria-modal="true" aria-labelledby="guest-title" className="popup__guest">
              <div>
                <h2 id="guest-title" className="text-h2">You're not logged in</h2>
                <p className="text-p text-color--75">Sign in to start saving your progress</p>
              </div>
              <div className="popup__guest-btns">
                <button className="btn btn--secondary popup__guest-btn" onClick={onClose}>Close</button>
                <Link to="/login" className="btn popup__guest-btn">Sign in</Link>
              </div>
            </div>
          </div>
        ):(
          <div role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title" 
            className="surface popup__container popup__add-edit"
          >
            <div className="popup__header">
              <div className="popup__header--title">
                <p className="text-p text-color--75">{action === "add" ? "Adding to my list" : "Editing"}</p>
                <h2 id="modal-title" className="text-h2 popup__title">{animeTitle}</h2>
              </div>
              {action==="edit" && (
                <div className="popup__options-content">
                  <button aria-label="More options" className="popup__options-btn" onClick={() => setIsOptionsOpen(true)}>
                    <IconDots className="icon-size-m"/>
                  </button>
                  {isOptionsOpen && (<OptionsPopUp isOpen={isOptionsOpen} onClose={()=> setIsOptionsOpen(false)} onDelete={deleteAnime}/>)}
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit(sendAction)} className="form popup__form"> 
              <div className="popup__form-inputs">
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
                <label htmlFor="score-selector" className="text-details">Personal Score</label>
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
                  <div className="popup__episodes-row">
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
                  </div>
                </div>
              )}

                <div className="popup__episodes-bar form__group">
                    <p className="text-details text-color--75 text-episodes-popup">{episodesValue} / {totalEpisodes} episodes</p>
                    <div className="popup__progress">
                      <div className="popup__progress-fill"
                        style={{ width: `${calculateWidth(totalEpisodes, episodesValue)}%`}}
                      ></div>
                    </div>
                </div>

              </div>
              <div className="form__group btn--popup-container">
                <button type="button" className="btn btn--secondary btn--popup" onClick={onClose}>Close</button>
                <button type="submit" className="btn btn--popup">Save</button>
              </div>
            </form>
          </div>
        )}
    </div>
  );
};

export default ModalAddEditAnime;
