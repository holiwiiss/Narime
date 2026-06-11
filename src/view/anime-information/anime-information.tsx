import "./anime-information.scss";
import type { AnimeCharactersType, AnimeInformationType } from "../../services/anime-information/anime-information.type";
import { Link, useLocation, useParams } from "react-router-dom";
import ErrorComponent from "../../components/error-component/error-component";
import LoadingComponent from "../../components/loading-component/loading-component";
import { useMyListMap } from "../../hooks/use-my-list-map";
import type { UserAnimeListFirestoreType } from "../../firebase/services/firestore-service.type";
import { useAnimeModal } from "../../hooks/use-anime-modal";
import { useQuery } from "@tanstack/react-query";
import { formatDate, formatNumber, formatSynopsis } from "../../utils/format";
import { useState } from "react";
import { fetchAnimeInformation } from "../../queries/anime-information-page.queries";
import { calculateWidth } from "../../utils/calculate-width";
import { formatStatus } from "../../utils/format-status";
import ModalAddEditAnime from "../../components/modals/modal-add-edit";
import Tabs from "../../components/ui/tabs/tabs";

const ANIME_INFO_TABS: { value: "sinopsis" | "actors" | "trailer"; label: string }[] = [
  { value: "sinopsis", label: "Synopsis" },
  { value: "actors", label: "Character roast" },
  { value: "trailer", label: "Trailer" },
]

const AnimePage = () => {

  const [activeCategory, setActiveCategory] = useState <"sinopsis" | "actors" | "trailer">("sinopsis")
  const [showAllCharacters, setShowAllCharacters] = useState(false)
  
  const modalAddEdit = useAnimeModal()
  const { id } = useParams();
  const animeID = Number(id);
  console.log(animeID + "aaa")

  const location = useLocation()
  const from = location.state?.from ?? "/"
  const fromLabel = location.state?.label ?? "Directory"

  const { getUserListData } = useMyListMap()
  const userData: UserAnimeListFirestoreType | undefined = getUserListData(animeID)

  const {isLoading, isError, data} = useQuery({
    queryKey:["animeInfo", animeID],
    queryFn:() => fetchAnimeInformation(animeID),
  })
  
  const animeInfo: AnimeInformationType | undefined = data?.info 
  const animeCharacters: AnimeCharactersType[] | undefined = data?.characters

  const openAddEditModal = (anime: AnimeInformationType) => {
      const userData = getUserListData(anime.id);
      modalAddEdit.openModal(anime.id, anime.episodes, anime.title, userData);
  };

  let visibleCharacters
  if (showAllCharacters) {
    visibleCharacters = animeCharacters
  } else {
    visibleCharacters = animeCharacters?.slice(0, 15)
  }

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

            <div className="anime-page__header">
              <figure className="anime-page__cover">
                <img src={animeInfo.image} className="anime-page__header-img" alt={ `Caption of ${animeInfo.title}`} />
              </figure>
            </div>

            <section className="anime-page__content">

              <nav aria-label="Breadcrumb" className="breadcrumbs">
                <ol className="breadcrumbs__list">
                  <li className="breadcrumbs__item">
                    <Link to={from}  className="text-details text-color--50">{fromLabel}</Link>
                  </li>
                  <li className="breadcrumbs__item">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white-50)" className="size-6 icon-size-m">
                      <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                    </svg>
                  </li>
                  <li className="breadcrumbs__item">
                    <p className="text-details text-color--75">{animeInfo.title}</p>
                  </li>
                </ol>
              </nav>

              <div className="anime-page__info">
                <div className="anime-page__info-texts">
                  <h1 className="text-h1 anime-page__info-title">{animeInfo.title}</h1>
                  <p className="text-p text-color--primary">{animeInfo.titleEnglish}</p>
                  <p className="text-p text-color--50">{formatDate(animeInfo.aired[0])} - {formatDate(animeInfo.aired[1])}</p>
                </div>
                <div className="anime-page__info-user-options">
                  {userData && (
                    <>
                      <p className="text-p text-color--50 anime-page__status-label">Your status:</p>
                      <span className="text-p text-color--75 anime-page__status-value">{formatStatus(userData.statusPersonal)}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="anime-page__stats">
                <button className="anime-page__btn icon-size-xl" 
                  aria-label={userData ? "Edit anime in list" : "Add anime to my list"}
                  onClick={()  => openAddEditModal(animeInfo)}
                >
                  {userData ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white)" className="size-6 icon-size-m" aria-hidden="true">
                      <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                    </svg>
                  ):(
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white)" className="size-6 icon-size-m" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <div className="anime-page__stats-global">
                  <div className="anime-page__stat-item">
                    <p className="text-h1">{animeInfo.score ?? "N/A"}</p>
                    <p className="text-details text-color--75 anime-page__content-item-label">Global Score</p>
                  </div>

                  {userData && userData.scorePersonal && (
                    <div className="anime-page__stat-item">
                      <p className="text-h1">{userData.scorePersonal}</p>
                      <p className="text-details text-color--75 anime-page__content-item-label">Your Score</p>
                    </div>
                  )}

                  <div className="anime-page__stat-item">
                    <p className="text-h1"># {animeInfo.rank ?? "N/A"}</p>
                    <p className="text-details text-color--75 anime-page__content-item-label">Ranked</p>
                  </div>

                  <div className="anime-page__stat-item">
                    <p className="text-h1">{formatNumber(animeInfo.members)}</p>
                    <p className="text-details text-color--75 anime-page__content-item-label">Watching</p>
                  </div> 
                </div>
                {userData && (
                  <div className="anime-page__progress">
                    <div className="anime-page__progress-header">
                      <p className="text-p">Your progress</p>
                      <p className="text-p">{userData.episodesWatched} / {animeInfo.episodes} episodes</p>
                    </div>
                    <div className="anime-page__progress-track">
                      <div className="anime-page__progress-fill"
                        style={{ width: `${calculateWidth(animeInfo.episodes, userData.episodesWatched)}%`}}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-h2">Tags</h2>
                <div className="anime-page__tags-list">
                  <div className="anime-page__tag"><p className="text-p text-color--75"># {animeInfo.season} {animeInfo.year ?? "N/A"}</p></div>
                  {animeInfo.genres.map((g)=> (
                    <div key={g} className="anime-page__tag"><p className="text-p text-color--75"># {g}</p></div>
                  ))}
                  {animeInfo.studios.map((s)=> (
                    <div key={s} className="anime-page__tag"><p className="text-p text-color--75"># {s}</p></div>
                  ))}
                </div>
              </div>
              
            </section>
          </div>

          <section className="anime-page__details" aria-label="Anime details">
            <div className="tab__container">
              <Tabs
                options={ANIME_INFO_TABS}
                activeValue={activeCategory}
                onChange={(value) => setActiveCategory (value as "sinopsis" | "actors" | "trailer")}
                variant="small"
              />
            </div>
            
            <div className="anime-page__details-body">
              <div className="anime-page__tabs-info">
                {activeCategory === "sinopsis" ? (
                  <div className="anime-page__synopsis-text">
                    {formatSynopsis(animeInfo.synopsis).map((paragraph, index) => (
                      <p key={index} className="text-p text-color--75">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : activeCategory==="actors" ? (
                  <>
                    <div className="anime-page__characters">
                      {animeCharacters?.length === 0 && (
                        <ErrorComponent text="Not found characters" />
                      )}

                      {visibleCharacters?.map((person: AnimeCharactersType) => (
                        
                        <article key={person.characterName} className="character-card">
                          <img className="character-card__img" src={person.characterImage} alt={person.characterName}/>
                        
                          <div className="character-card__header">
                            <span className="text-details badge text-shadow">{person.role}</span>
                          </div>
                        
                          <div className="character-card__footer">
                            <div className="character-card__footer-text">
                              <p className="text-card--small character-card__name">{person.characterName}</p>
                              <p className="text-details character-card__actor-name">CV <br/> {person.voiceActorName}</p>
                            </div>
                            <img className="character-card__actor-img" src={person.voiceActorImage} alt={person.voiceActorName}></img>
                          </div>
                      </article>
                      ))}
                    </div>

                    {animeCharacters && animeCharacters.length > 15 && (
                      <div className="anime-page__characters-actions">
                        <button 
                          className="btn btn--secondary" 
                          onClick={() => setShowAllCharacters(!showAllCharacters)}
                        >
                          {showAllCharacters ? "Show less" : "Show all characters"}
                        </button>
                      </div>
                    )}

                  </>
                  ) : (
                    <>
                      {!animeInfo.trailer || animeInfo.trailer==="" ? (
                        <ErrorComponent text="No trailer found"/>
                      ):(
                        <iframe 
                          className="anime-page__trailer" 
                          src={animeInfo.trailer} 
                          title={`Trailer of ${animeInfo.title}`} 
                          allow="accelerometer; autoplay; encrypted-media"
                          allowFullScreen
                          sandbox="allow-scripts allow-same-origin allow-presentation" 
                        />
                      )}
                    </>
                  )}   
                </div> 

                <div className="anime-page__more-info">
                  <div className="anime-page__more-info-item">
                    <h3 className="anime-page__more-info-item-title">Format</h3>
                    <p className="text-details text-color--75">{animeInfo.year ?? "N/A"}  ·  {animeInfo.type}  ·  {animeInfo.episodes} episodes</p>
                  </div>

                  <div className="anime-page__more-info-item">
                    <h3 className="anime-page__more-info-item-title">Studio</h3>
                    <div className="anime-page__more-info-item-values">
                      {animeInfo.studios.map((s)=> (
                        <p className="text-details text-color--75">{s} </p>
                      ))}
                    </div>
                  </div>

                  <div className="anime-page__more-info-item">
                    <h3 className="anime-page__more-info-item-title">Genres</h3>
                    <div className="anime-page__more-info-item-values">
                      {animeInfo.genres.map((g)=> (
                        <p className="text-details text-color--75">{g} </p>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            
              
            
        </section>
      </main>
</>
)}

      {modalAddEdit.isOpen && modalAddEdit.animeId &&(
        <ModalAddEditAnime
          animeId={modalAddEdit.animeId}
          totalEpisodes = {modalAddEdit.animeEpisodes}
          animeTitle={modalAddEdit.animeTitle}
          action={modalAddEdit.action}
          infoDocIdUserAnime = {modalAddEdit.infoDocIdFromUser}
          onClose={modalAddEdit.closeModal}
        />
      )}
    </>
  );
};

export default AnimePage;