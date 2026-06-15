import "./anime-information.scss";
import type { AnimeCharactersType, AnimeInformationType } from "../../services/anime-information/anime-information.type";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
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
import { truncateWords } from "../../utils/truncate-word";
import Review from "../../components/reviews/review";
import { getRecomendationsAnimes } from "../../services/anime-recommendations/anime-recommendations";

const ANIME_INFO_TABS: { value: "sinopsis" | "actors" | "trailer" | "similars"; label: string }[] = [
  { value: "sinopsis", label: "Synopsis" },
  { value: "actors", label: "Character roast" },
  { value: "trailer", label: "Trailer" },
  { value: "similars" , label: "Similars"}
]
const fecthAnimesRecommendations = async (animeId:number) => {
  const data = await getRecomendationsAnimes(animeId)
  return data
}

const AnimePage = () => {

  const [activeCategory, setActiveCategory] = useState <"sinopsis" | "actors" | "trailer">("sinopsis")
  const [showAllCharacters, setShowAllCharacters] = useState(false)
  
  const modalAddEdit = useAnimeModal()
  const { id } = useParams();
  const animeID = Number(id);
  const navigate = useNavigate()

  const location = useLocation()
  const from = location.state?.from ?? "/directory"
  const fromLabel = location.state?.label ?? "Directory"

  const { getUserListData } = useMyListMap()
  const userData: UserAnimeListFirestoreType | undefined = getUserListData(animeID)

  const {isLoading, isError, data} = useQuery({
    queryKey:["animeInfo", animeID],
    queryFn:() => fetchAnimeInformation(animeID),
  })

  const {isLoading: isLoadingRecommendationsAnime, isError: isErrorRecommendationsAnime, data: recommendationsListAnime} = useQuery({
    queryKey:["recommendationsList", animeID],
    queryFn: () => fecthAnimesRecommendations(animeID),
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

  const CARDS = [
    {username: "Evoo", avatar: "https://i.pinimg.com/736x/2f/49/df/2f49dfa3f97e24eec56d24e9d704c43b.jpg" , review: "I really enjoyed this. The quality was good and it kept me interested from start to finish.", status: "completed", score:9},
    {username: "Holiwiis", avatar: "https://i.pinimg.com/1200x/92/41/92/924192b2cdbec6802e7fe4229e2e1bd9.jpg" , review: "A very enjoyable experience overall. I liked it and would recommend it to others.", status: "completed", score:10},
    {username: "Inoos", avatar: "https://i.pinimg.com/736x/27/ac/79/27ac796cfd2503506d53c20d93353448.jpg" , review: "This was better than I expected. It was interesting, well made, and worth checking out.", status: "watching", score:8},
    {username: "Argüiñan0", avatar: "https://i.pinimg.com/736x/2d/e3/0d/2de30d1a61362c24cf88deda925d610e.jpg" , review: "I liked this a lot. Everything was easy to follow and enjoyable.", status: "completed", score:10},
  ]

  if (isLoading) return <LoadingComponent />
  if (isError) return <ErrorComponent text="Something went wrong loading the anime data" />

  return (
    <>
      {!animeInfo ? (
        <h1>No anime found</h1>
      ) : (
        <div className="anime-page content-max">

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
                    <p className="text-details text-color--75"> {truncateWords(animeInfo.title, 3)}</p>
                  </li>
                </ol>
              </nav>

              <div className="anime-page__info">
                <div className="anime-page__info-texts">
                  <h1 className="text-h1 anime-page__info-title">{animeInfo.title}</h1>
                  <p className="text-p text-color--primary">{animeInfo.titleEnglish}</p>
                  <p className="text-details text-color--50">{formatDate(animeInfo.aired[0])} - {formatDate(animeInfo.aired[1])}</p>
                </div>
                <div className="anime-page__info-user-options">
                  {userData && (
                    <>
                      <span className="text-p text-color--75 badge" data-status={userData.statusPersonal}>{formatStatus(userData.statusPersonal)}</span>
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
                    <p className="anime-page__more-info-item-title anime-page__content-item-label">Global score</p>
                  </div>

                  {userData && userData.scorePersonal && (
                    <div className="anime-page__stat-item">
                      <p className="text-h1">{userData.scorePersonal}</p>
                      <p className="anime-page__more-info-item-title anime-page__content-item-label">YOUR SCORE</p>
                    </div>
                  )}

                  <div className="anime-page__stat-item">
                    <p className="text-h1"># {animeInfo.rank ?? "N/A"}</p>
                    <p className="anime-page__more-info-item-title anime-page__content-item-label">RANKED</p>
                  </div>

                  <div className="anime-page__stat-item">
                    <p className="text-h1">{formatNumber(animeInfo.members)}</p>
                    <p className="anime-page__more-info-item-title anime-page__content-item-label">WATCHING</p>
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

              {/*<div>
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
              </div>*/}

              <div>
                <h2 className="text-h2">Highlighted reviews</h2>
                <div className="review_carousel">
                  <div className="review_carousel_track">
                     {[...CARDS, ...CARDS].map((card, i) => (
                      <Review key={i} {...card} />
                    ))}
                  </div>
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
                  ) : activeCategory === "trailer" ? (
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
                  ) : (
                    <>
                      {isLoadingRecommendationsAnime ? (
                        <LoadingComponent/>
                      ): !isLoadingRecommendationsAnime && isErrorRecommendationsAnime ? (
                        <ErrorComponent text="Something went wrong"/>
                      ): (
                        <ul className="anime-page__characters">
                        {recommendationsListAnime?.slice(0, 15).map((anime) => {
                          return(
                            <li key={anime.id} className="character-card anime-page-recomendations" onClick={()=> navigate(`/anime/${anime.id}`)}>
                              <img className="character-card__img" src={anime.image} alt={anime.title}/>
                              <div></div>
                              <div className="character-card__footer">
                                <div className="character-card__footer-text">
                                  <p className="text-card--small character-card__name">{anime.title}</p>
                                </div>
                              </div>
                            </li>
                          )
                        })}
                        </ul>
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
      </div>

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