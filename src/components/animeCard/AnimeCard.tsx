import React from "react";
import type { UserAnimeListFirestoreType } from "../../firebase/services/firestoreService.type";
import type { AnimeListType } from "../../services/anime-list/anime-list.type";
import { useNavigate } from "react-router-dom";

type PropsAnimeCard = {
  anime: AnimeListType;
  userData?: UserAnimeListFirestoreType;
  onOpenModal: (animeId: number) => void;
}

const AnimeCard = ({anime, userData, onOpenModal}: PropsAnimeCard) => {

  const navigate = useNavigate()

  return(
    <div className="anime__card" onClick={() => navigate(`/anime/${anime.id}`)}>
      <h1>{anime.title}</h1>
      <img src={anime.image}/>
      <div className="information__container">
        <h2>Score: {anime.score}</h2>
        <h2>Episodes: {anime.episodes}</h2>
      </div>
      {userData && (
        <div className="mylist__info">
          <p>My status: {userData.statusPersonal}</p>
          <p>My score: {userData.scorePersonal}</p>
          <p>episodes Watched: {userData.episodesWatched}</p>
        </div>
      )}
      <button onClick={(e) => {
        e.stopPropagation()
        onOpenModal(anime.id)
      }}>
        {userData ? "Edit" : "Add "}
      </button>
    </div>
  )
};
// hace que no se vuelva a renderizar la carta si sus propiedades no han cambiado
//cuando aplicamos filtros
export default React.memo(AnimeCard)
