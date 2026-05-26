import "./animepage.scss";
import type { AnimeCharactersType, AnimeInformationType } from "../../services/anime-information/anime-information.type";
import { Link, useParams } from "react-router-dom";
import ErrorComponent from "../../components/error/ErrorComponent";
import LoadingComponent from "../../components/loading/LoadingComponent";
import { useMyListMap } from "../../hooks/useMyListMap";
import type { UserAnimeListFirestoreType } from "../../firebase/services/firestoreService.type";
import ModalAddEditAnime from "../../components/modalAddEditAnime/ModalAddEditAnime";
import { useAnimeModal } from "../../hooks/useAnimeModal";
import { useQuery } from "@tanstack/react-query";
import { formatDate, formatNumber } from "../../utils/format";
import { useState } from "react";
import { fetchAnimeInformation } from "../../queries/anime-information-page.queries";
import { calculateWidth } from "../../utils/calculateWidth";
import { formatStatus } from "../../utils/formatStatus";

const AnimePage = () => {

  const [activeCategory, setActiveCategory] = useState <"sinopsis" | "actors" | "trailer">("sinopsis")
  
  const modalAddEdit = useAnimeModal()
  const { id } = useParams();
  const animeID = Number(id);

  const { getUserListData } = useMyListMap()
  const userData: UserAnimeListFirestoreType | undefined = getUserListData(animeID)

  const {isLoading, isError, data } = useQuery({
    queryKey:["animeInfo", animeID],
    queryFn:() => fetchAnimeInformation(animeID),
  })
  
  const animeInfo: AnimeInformationType | undefined = data?.info 
  const animeCharacters: AnimeCharactersType[] | undefined = data?.characters

  const openAddEditModal = (anime: any) => {
      const userData = getUserListData(anime.id);
      modalAddEdit.openModal(anime.id, anime.episodes, userData);
  };

  if (isLoading) return <LoadingComponent />
  if (isError) return <ErrorComponent text="Something went wrong loading the anime data" />

  return (
    <>
      {!animeInfo ? (
        <h1>No anime found</h1>
      ) : (
        <>
        <main className="anime-page">

          <div className="anime-page__container">

            <header className="anime-page__header">
              <img src={animeInfo.image} className="anime-page__header-img" alt={animeInfo.title}></img>
              
            </header>

            <section className="anime-page__content">

              <div className="breadcrumbs__container">
                <Link to="/directory" className="breadcrumbs__container-text breadcrumbs__unselected">Directory</Link>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white-50)" className="size-6 icon-size-m">
                  <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                </svg>
                <p className="breadcrumbs__container-text">{animeInfo.title}</p>
              </div>

              <div className="anime-page__content-info">
                <div className="anime-page__content-texts">
                  <h1 className="anime-page__content-info-tittle">{animeInfo.title}</h1>
                  <h2 className="anime-page__content-info-tittle-english"><i>{animeInfo.titleEnglish}</i></h2>
                  <p className="anime-page__content-info-date">{formatDate(animeInfo.aired[0])} - {formatDate(animeInfo.aired[1])}</p>
                </div>
                <div className="anime-page__content-user-options">
                  {userData && (
                    <>
                      <p className="anime-page__status-text">Your status:</p>
                      <span className="anime-page__status-user">{formatStatus(userData.statusPersonal)}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="anime-page__content-stats">
                <button className="btn--anime-page icon-size-xl" onClick={()  => openAddEditModal(animeInfo)}>
                  {userData ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white)" className="size-6 icon-size-m">
                      <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                    </svg>
                  ):(
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white)" className="size-6 icon-size-m">
                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                    </svg>
                  )}</button>
                <div className="content__main-stats">
                  <div className="anime-page__content-item">
                    <p className="anime-page__content-item--number">{animeInfo.score ?? "N/A"}</p>
                    <p className="anime-page__content-item--text">Global Score</p>
                  </div>

                  {userData && userData.scorePersonal && (
                    <div className="anime-page__content-item">
                      <p className="anime-page__content-item--number">{userData.scorePersonal}</p>
                      <p className="anime-page__content-item--text">Your Score</p>
                    </div>
                  )}

                  <div className="anime-page__content-item">
                    <p className="anime-page__content-item--number"># {animeInfo.rank ?? "N/A"}</p>
                    <p className="anime-page__content-item--text">Ranked</p>
                  </div>

                  <div className="anime-page__content-item">
                    <p className="anime-page__content-item--number">{formatNumber(animeInfo.members)}</p>
                    <p className="anime-page__content-item--text">Watching</p>
                  </div> 
                </div>
                {userData && (
                  <div className="content__user--progress-bar--container">
                    <div className="content__user--progress-bar--tittle-containers">
                      <p className="content__user--progress-bar--text">Your progress</p>
                      <p>{userData.episodesWatched} / {animeInfo.episodes} episodes</p>
                    </div>
                    <div className="content__user--progress-bar--empty">
                      <div className="content__user--progress-bar--value"
                        style={{ width: `${calculateWidth(animeInfo.episodes, userData.episodesWatched)}%`}}
                      ></div>
                    </div>
                  </div>
                )}
                
              </div>

              <div className="anime-page__content-tags">
                <h2>Tags</h2>
                <div className="anime-page__content-all-tags">
                  <div className="anime-page__content-tag"><p># {animeInfo.season} {animeInfo.year ?? "N/A"}</p></div>
                  {animeInfo.genres.map((g)=> (
                    <div key={g} className="anime-page__content-tag"><p># {g}</p></div>
                  ))}
                  {animeInfo.studios.map((s)=> (
                    <div key={s} className="anime-page__content-tag"><p># {s}</p></div>
                  ))}
                </div>
              </div>

              
            </section>
          </div>

          <footer className="anime-page__end-section">
            <div className="tab__container">
                <div className="tab__buttons">
                  <button className={`tab-option tab-option--small ${activeCategory === 'sinopsis' ? "tab-option__selected--small" : "tab-option__unselected"}`} onClick={() => setActiveCategory("sinopsis")}>Synopsis</button>
                  <button className={`tab-option tab-option--small ${activeCategory === 'actors' ? "tab-option__selected--small" : "tab-option__unselected"}`} onClick={() => setActiveCategory("actors")}>Character roster</button>
                  <button className={`tab-option tab-option--small ${activeCategory === 'trailer' ? "tab-option__selected--small" : "tab-option__unselected"}`} onClick={() => setActiveCategory("trailer")}>Trailer</button>
                </div>
              </div>
              <div className="anime-page__tab-info">
                <div className="anime-page__content-synopsis">
                  {activeCategory === "sinopsis" ? (
                    <p>{animeInfo.synopsis}</p>
                  ) : activeCategory==="actors" ? (
                    <div className="anime-page__character--wrapper">
                      {animeCharacters?.map((person: AnimeCharactersType) => (
                      <div className="character-card">
                        <img className="character-card__img" src={person.characterImage} alt={person.characterName}/>
                        
                        <div className="character-card--header">
                          <span className="character-card__badge">{person.role}</span>
                        </div>
                        
                        <div className="character-card--foter">
                          <div className="character-card--foter-text">
                            <p className="character-card__anime-name">{person.characterName}</p>
                            <p className="character-card__actor-name">CV · {person.voiceActorName}</p>
                          </div>
                          <img className="character-card__img-actor" src={person.voiceActorImage} alt={person.voiceActorName}></img>
                        </div>
                      </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {!animeInfo.trailer || animeInfo.trailer==="" ? (
                        <ErrorComponent text="No trailer found"/>
                      ):(
                        <iframe className="anime-page__trailer" src={animeInfo.trailer} title="YouTube video player"  ></iframe> 
                      )}
                    </>
                  )}   
                </div> 

                <div className="anime-page__end-section-more-information">
                  <div className="more-information--item">
                    <h3 className="more-information--item-tittle">Format</h3>
                    <p className="more-information--item-subtittle">{animeInfo.year ?? "N/A"}  ·  {animeInfo.type}  ·  {animeInfo.episodes} episodes</p>
                  </div>

                  <div className="more-information--item">
                    <h3 className="more-information--item-tittle">Studio</h3>
                    <div className="more-information--item-subtittle-container">
                      {animeInfo.studios.map((s)=> (
                        <p className="more-information--item-subtittle">{s} </p>
                      ))}
                    </div>
                  </div>

                  <div className="more-information--item">
                    <h3 className="more-information--item-tittle">Genres</h3>
                    <div className="more-information--item-subtittle-container">
                      {animeInfo.genres.map((g)=> (
                        <p className="more-information--item-subtittle">{g} </p>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            
              
            
        </footer>
      </main>
</>
)}

      {modalAddEdit.isOpen && modalAddEdit.animeId &&(
        <ModalAddEditAnime
          animeId={modalAddEdit.animeId}
          totalEpisodes = {modalAddEdit.animeEpisodes}
          action={modalAddEdit.action}
          infoDocIdUserAnime = {modalAddEdit.infoDocIdFromUser}
          onClose={modalAddEdit.closeModal}
        />
      )}
    </>
  );
};

export default AnimePage;

/*
{animeCharacters?.map((person: AnimeCharactersType) => (
  <div className="character-card">
    <div className="character-card__img character-card__anime--img" style={{ backgroundImage: `url(${person.characterImage})` }}>
      <p className="character-card__role">{person.role}</p>
      <p className="character-card__anime-name">{person.characterName}</p>
    </div>
    <div className="character-card__img character-card__actor--img" style={{ backgroundImage: `url(${person.voiceActorImage})` }}>
      <p className="character-card__actor-name">{person.voiceActorName}</p>
    </div>
  </div>
))}


*/