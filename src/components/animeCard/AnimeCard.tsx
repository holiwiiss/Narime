import React from "react";
import type { UserAnimeListFirestoreType } from "../../firebase/services/firestoreService.type";
import type { AnimeCardType } from "../../services/anime-list/anime-list.type";
import { useNavigate} from "react-router-dom";
import "./animeCard.scss"
import { calculateWidth } from "../../utils/calculateWidth";
import { formatStatus } from "../../utils/formatStatus";
import type { AnimeRecomendationCardType } from "../../services/anime-recommendations/anime-recommendations.type";

type PropsAnimeCard = {
  anime: AnimeCardType | AnimeRecomendationCardType;
  userData?: UserAnimeListFirestoreType;
  onOpenModal?: (animeId: number) => void;
  variant?: "default" | "minimal" | "directory" | "upcoming" | "mylist" | "recomendations" ;
}

const AnimeCard = ({anime, userData, onOpenModal, variant="default"}: PropsAnimeCard) => {

  const isMinimal = variant === "minimal"
  const isDirectory = variant === "directory"
  const isUpcoming = variant === "upcoming"
  const isMyList = variant === "mylist"
  const isRecommendations = variant ==="recomendations"

  const navigate = useNavigate()

  return(
    <div className="anime-card-wrapper">
      <article className="anime-card" onClick={()=> navigate(`/anime/${anime.id}`)}>
        <img className="anime-card-img" src={anime.image} alt={anime.title}></img>
        <header className="anime-card__header">

        {isRecommendations || isMinimal? (
          <></>
        ): isMyList ? (
          <div className="anime-card__score">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="var(--color-red-primary)" className="size-4 icon-size-m">
              <path fillRule="evenodd" d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z" clipRule="evenodd" />
            </svg>
            <p className="text-details">{userData?.scorePersonal ?? "N/A"}</p>
          </div>
        ) : (
          <div className="anime-card__score">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#CFA80B" className="size-4 icon-size-m">
              <path fillRule="evenodd" d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z" clipRule="evenodd" />
            </svg>
            <p className="text-details">{anime.score ?? "N/A"}</p>
          </div>
        )}
          

          {!isMinimal && userData && (<span className="anime-card__user-status text-details" data-status={userData.statusPersonal}>{formatStatus(userData.statusPersonal)}</span>)}
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
              
              <button className={`btn btn--small anime-card__button ${userData ? "btn--secondary" : ""}`} onClick={(e) => {
              e.stopPropagation()
              onOpenModal(anime.id)
              }}>
                {userData ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white)" className="size-6 icon-size-m">
                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                  </svg>
                ):(
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white)" className="size-6 icon-size-m">
                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="text-btn btn-anime-card__text">{userData ? "Edit" : "Add"}</span>
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

// hace que no se vuelva a renderizar la carta si sus propiedades no han cambiado
//cuando aplicamos filtros
export default React.memo(AnimeCard)
