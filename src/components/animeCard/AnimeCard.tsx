import React from "react";
import type { UserAnimeListFirestoreType } from "../../firebase/services/firestoreService.type";
import type { AnimeListType } from "../../services/anime-list/anime-list.type";
import { useNavigate } from "react-router-dom";
import "./animeCard.scss"

type PropsAnimeCard = {
  anime: AnimeListType;
  userData?: UserAnimeListFirestoreType;
  onOpenModal: (animeId: number) => void;
}

const AnimeCard = ({anime, userData, onOpenModal}: PropsAnimeCard) => {

  const navigate = useNavigate()

  const calculateWidth =( total:number, watched:number ) => {
    return (100/total * watched)
  }

  return(
    <div className="anime-card-wrapper">
      <article className="anime-card" style={{ backgroundImage: `url(${anime.image})` }} onClick={() => navigate(`/anime/${anime.id}`)}>
        
        <header className="anime-card__header">
          <div className="anime-card__score">
            <img className="anime-card__score-icon" src="#" />
            <p className="anime-card__score-text">{anime.score}</p>
          </div>

          {userData && (<span className="anime-card__user-status" data-status={userData.statusPersonal}>{userData.statusPersonal}</span>)}
        </header>

        <footer className="anime-card__footer">
          <div className="anime-card__options">
            <div className="anime-card__info">
              <p className="anime-card__episodes"> {userData ? `${userData.episodesWatched} / ${anime.episodes} episodes` : `${anime.episodes} episodes`}</p>
              <h2 className="anime-card__title">{anime.title}</h2>
            </div>

            <button className={`btn btn--small anime-card__button ${userData ? "btn--secondary" : ""}`} onClick={(e) => {
              e.stopPropagation()
              onOpenModal(anime.id)
            }}>
              <img className="anime-card__button-img"></img>
              {userData ? "Edit" : "Add "}
            </button>
          </div>

          <div className="anime-card__progressbar">
            {userData && (
              <div className="anime-card__progressbar-content" 
              style={{ width: `${calculateWidth(anime.episodes, userData.episodesWatched)}%`}}></div>
            )}
          </div>
        </footer>
      </article>
      <p className="anime-card__meta">Tv | Fantasy</p>
    </div>
  )
};

// hace que no se vuelva a renderizar la carta si sus propiedades no han cambiado
//cuando aplicamos filtros
export default React.memo(AnimeCard)
