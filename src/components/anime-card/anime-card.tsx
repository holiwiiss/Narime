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
  index?: number
  userData?: UserAnimeListFirestoreType;
  onOpenModal?: (animeId: number) => void;
  variant?: "default" | "minimal" | "directory" | "upcoming" | "mylist" | "recomendations";
  fromState?: { from: string; label: string }; 
}

const AnimeCard = ({anime, index =0, userData, onOpenModal, variant="default", fromState}: PropsAnimeCard) => {

  const isMinimal = variant === "minimal"
  const isDirectory = variant === "directory"
  const isUpcoming = variant === "upcoming"
  const isMyList = variant === "mylist"
  const isRecommendations = variant ==="recomendations"

  const showScore = !isRecommendations && !isMinimal
  const showMeta = isDirectory || isUpcoming
  const showEpisodes = !isMinimal && !isRecommendations && !isDirectory && !isUpcoming
  const showProgressBar = !isMinimal && !isDirectory && !isUpcoming && !isRecommendations


  const navigate = useNavigate()

  return(
    <li className="anime-card-wrapper" style={{ '--delay': `${index * 0.05}s` } as React.CSSProperties}>
      <article className="anime-card" onClick={()=> navigate(`/anime/${anime.id}`, { state: fromState })}>
        <img className="anime-card-img" src={anime.image} alt={anime.title}></img>
        <header className="anime-card__header">
          {showScore && (
            <div aria-label={`Score: ${anime.score}`} className="action-item anime-card__score">
              <IconStar fill={isMyList ? "var(--color-red-primary)" : undefined} className="size-6 action-item__icon"/>
              <p className="text-details">{isMyList ? userData?.scorePersonal ?? "N/A" : anime.score ?? "N/A"}</p>
            </div>
          )}
          {!isMinimal && userData && (<span className="badge text-details" data-status={userData.statusPersonal}>{formatStatus(userData.statusPersonal)}</span>)}
        </header>

        <footer className="anime-card__footer">
          <div className="anime-card__options">
            <div className="anime-card__info">
              {showMeta && <p className="text-details">{anime.type} · {anime.year ?? "N/A"}</p>}

              {showEpisodes && (
                <p className="text-details">
                  {userData ? `${userData.episodesWatched} / ${anime.episodes} episodes` : `${anime.episodes} episodes`}
                </p>
              )}
              <h2 className="text-card anime-card__title">{anime.title}</h2>
            </div>
              
            {onOpenModal && (
            
              <button className={`btn btn--small action-item anime-card__button ${userData ? "btn--secondary" : ""}`} onClick={(e) => {
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
          {showProgressBar && (
            <div className="anime-card__progressbar">
              {userData && (
                <div className="anime-card__progressbar-content" 
                  style={{ width: `${calculateWidth(anime.episodes ?? 1, userData.episodesWatched)}%`}}
                />
              )}
            </div>
          )}
        </footer>
      </article>
    </li>
  )
};

export default React.memo(AnimeCard)
