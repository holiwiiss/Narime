import React from "react";
import type { UserAnimeListFirestoreType } from "../../firebase/services/firestore-service.type";
import type { AnimeCardType } from "../../services/anime-list/anime-list.type";
import { useNavigate} from "react-router-dom";
import "./anime-card.scss"
import { calculateWidth } from "../../utils/calculate-width";
import { formatStatus } from "../../utils/format-status";
import type { AnimeRecomendationCardType } from "../../services/anime-recommendations/anime-recommendations.type";
import IconPlus from "../ui/icons/icon-plus";
import IconEdit from "../ui/icons/icon-edit";
import IconStar from "../ui/icons/icon-star";

type PropsAnimeCard = {
  anime: AnimeCardType | AnimeRecomendationCardType;
  userData?: UserAnimeListFirestoreType;
  onOpenModal?: (animeId: number) => void;
  variant?: "default" | "minimal" | "directory" | "upcoming" | "mylist" | "recomendations";
  fromState?: { from: string; label: string }; 
}

const AnimeCard = ({anime, userData, onOpenModal, variant="default", fromState}: PropsAnimeCard) => {

  const isMinimal = variant === "minimal"
  const isDirectory = variant === "directory"
  const isUpcoming = variant === "upcoming"
  const isMyList = variant === "mylist"
  const isRecommendations = variant ==="recomendations"

  const navigate = useNavigate()

  return(
    <div className="anime-card-wrapper">
      <article className="anime-card" onClick={()=> navigate(`/anime/${anime.id}`, { state: fromState })}>
        <img className="anime-card-img" src={anime.image} alt={anime.title}></img>
        <header className="anime-card__header">

        {isRecommendations || isMinimal? (
          <></>
        ): isMyList ? (
          <div className="action-item anime-card__score">
            <IconStar fill="var(--color-red-primary)" className="size-6 action-item__icon"/>
            <p className="text-details">{userData?.scorePersonal ?? "N/A"}</p>
          </div>
        ) : (
          <div className="action-item anime-card__score">
            <IconStar className="size-6 action-item__icon"/>
            <p className="text-details">{anime.score ?? "N/A"}</p>
          </div>
        )}
        {!isMinimal && userData && (<span className="badge text-details" data-status={userData.statusPersonal}>{formatStatus(userData.statusPersonal)}</span>)}
        </header>

        <footer className="anime-card__footer">
          <div className="anime-card__options">
            <div className="anime-card__info">
              {isRecommendations || isMinimal ? (
                <></>
              ): isDirectory || isUpcoming ? (
                <p className="text-details">{anime.type} · {anime.year ?? "N/A"}</p>
              ): (
                <p className="text-details"> {!isMinimal && userData ? `${userData.episodesWatched} / ${anime.episodes} episodes` : `${anime.episodes} episodes`}</p>
              )}
              <h2 className="text-card anime-card__title">{anime.title}</h2>
            </div>
              
            {onOpenModal && (
              
              <button className={`btn btn--small action-item ${userData ? "btn--secondary" : ""}`} onClick={(e) => {
              e.stopPropagation()
              onOpenModal(anime.id)
              }}>
                {userData ? (
                  <IconEdit className="size-6 action-item__icon"/>
                ) : (
                  <IconPlus className="size-6 action-item__icon"/>
                )}
                <span className="text-btn action-item__text">{userData ? "Edit" : "Add"}</span>
              </button>
            )}
          </div>
          {isMinimal || isDirectory || isUpcoming || isRecommendations ? (<></>):(
            <div className="anime-card__progressbar">
              {userData && (
                <div className="anime-card__progressbar-content" 
                style={{ width: `${calculateWidth(anime.episodes ?? 1, userData.episodesWatched)}%`}}></div>
              )}
            </div>
          )}
        </footer>
      </article>
      {variant==="default"  && (<p className="text-details">{anime.type} · {anime.year ?? "N/A"}</p>)}
    </div>
  )
};

export default React.memo(AnimeCard)
