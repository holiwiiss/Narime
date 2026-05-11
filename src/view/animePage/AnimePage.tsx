import { useEffect, useState } from "react";
import "./animepage.scss";
import type { AnimeCharactersType, AnimeInformationType } from "../../services/anime-information/anime-information.type";
import { useParams } from "react-router-dom";
import { getAnimeCharacters, getAnimeInformation } from "../../services/anime-information/anime-information";
import ErrorComponent from "../../components/error/ErrorComponent";
import LoadingComponent from "../../components/loading/LoadingComponent";
import { useMyListMap } from "../../hooks/useMyListMap";
import type { UserAnimeListFirestoreType } from "../../firebase/services/firestoreService.type";

const AnimePage = () => {
  const [animeInfo, setAnimeInfo] = useState<AnimeInformationType | null>(null);
  const [animeCharacters, setAnimeCharacters] = useState<AnimeCharactersType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserAnimeListFirestoreType | undefined>(undefined);
  const [activeCategory, setActiveCategory] = useState <"sinopsis" | "actors">("sinopsis")
  
  const { id } = useParams();
  const animeID = Number(id);
  const { getUserListData } = useMyListMap()

  useEffect(() => {

    if(!id || isNaN(animeID)) {
      setIsError('El id del anime no es válido')
      setIsLoading(false)
      return
    }
    
    setUserData(getUserListData(animeID))

    const fetchAnimes = async () => {
      setIsLoading(true)
      setIsError(null)
      try {
        const [info, characters] = await Promise.all([
          getAnimeInformation(animeID),
          getAnimeCharacters(animeID)
        ]);

        setAnimeInfo(info);
        setAnimeCharacters(characters);
      } catch (e) {
        console.log("La api no responde " + e);
        setIsError('Ha habido un error con la carga de la API')
      }finally{
        setIsLoading(false)
      }
    };
    fetchAnimes();
  }, [animeID]);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-ES", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(num);
  };

  if (isLoading) return <LoadingComponent text="Cargando datos del anime..." />
  if (isError) return <ErrorComponent text={isError} />

  return (
    <>
      {!animeInfo ? (
        <h1>no hay anime</h1>
      ) : (
        <>
        <main className="anime-page">
          <div className="anime-page__container">

            <header className="anime-page__header">
              <img src={animeInfo.images} className="anime-page__header-img" alt={animeInfo.title}></img>
              
              {userData && (
                <form className="anime-page__header-form">

                <div className="anime-page__header-form-group">
                  <label>Status</label>
                  <select defaultValue="Watching">
                    <option>Watching</option>
                    <option>Completed</option>
                    <option>Plan to watch</option>
                    <option>Dropped</option>
                  </select>
                </div>

                <div className="anime-page__header-form-group">
                  <label>Score</label>
                  <select defaultValue="10">
                    <option>Score</option>
                  </select>
                </div>

                <div className="anime-page__header-form-group">
                  <p>Episodes watched</p>
                </div>

              </form>
              )}
            </header>

            <section className="anime-page__content">
              <div className="anime-page__content-info">
                <h1>{animeInfo.title}</h1>
                <h2 className="anime-page__content-info-tittle-english"><i>{animeInfo.titleEnglish}</i></h2>
                <p className="anime-page__content-info-date"><i>{formatDate(animeInfo.aired[0])} - {formatDate(animeInfo.aired[1])}</i></p>

                <div className="anime-page__content-stats">
                  <div className="anime-page__content-stat">
                    <p className="anime-page__content-stat-number">{animeInfo.score}</p>
                    <p>Global Score</p>
                  </div>

                  {userData && (
                    <div className="anime-page__content-stat">
                      <p className="anime-page__content-stat-number">{userData.scorePersonal}</p>
                      <p>Your Score</p>
                    </div>
                  )}

                  <div className="anime-page__content-stat">
                    <p className="anime-page__content-stat-number"># {animeInfo.rank}</p>
                    <p>Ranked</p>
                  </div>

                  <div className="anime-page__content-stat">
                    <p className="anime-page__content-stat-number">{formatNumber(animeInfo.members)}</p>
                    <p>Watching</p>
                  </div>  
                </div>
              </div>

              <div className="anime-page__content-tags">
                <h2>Hastags</h2>
                <div className="anime-page__content-all-tags">
                  <div className="anime-page__content-tag"><p># {animeInfo.type}</p></div>
                  <div className="anime-page__content-tag"><p># {animeInfo.season} {animeInfo.year}</p></div>
                  {animeInfo.genres.map((g)=> (
                    <div className="anime-page__content-tag"><p># {g}</p></div>
                  ))}
                  {animeInfo.studios.map((s)=> (
                    <div className="anime-page__content-tag"><p># {s}</p></div>
                  ))}
                </div>
              </div>
              <footer className="anime-page__end-section">
                <div className="tab__container">
                  <div className="tab__buttons">
                    <button className={`tab-option ${activeCategory === 'sinopsis' ? "tab-option__selected" : "tab-option__unselected"}`} onClick={() => setActiveCategory("sinopsis")}>Sinopsis</button>
                    <button className={`tab-option ${activeCategory === 'actors' ? "tab-option__selected" : "tab-option__unselected"}`} onClick={() => setActiveCategory("actors")}>Voice actors and characters</button>
                  </div>
                </div>
                <div className="anime-page__content-synopsis">
                  {activeCategory === "sinopsis" ? (
                    <p>{animeInfo.synopsis}</p>
                  ):(
                    <div className="anime-page__container--character">
                      {animeCharacters.map((person: AnimeCharactersType) => (
                      <div className="character-card">
                        <div className="character-card__anime--img" style={{ backgroundImage: `url(${person.characterImage})` }}>
                          <p className="character-card__role">{person.role}</p>
                          <p className="character-card__anime-name">{person.characterName}</p>
                        </div>
                        <div className="character-card__actor--img" style={{ backgroundImage: `url(${person.voiceActorImage})` }}>
                          <p className="character-card__actor-name">{person.voiceActorName}</p>
                        </div>
                      </div>
                      ))}
                    </div>
                  )}
                    
                </div>
              </footer>
            </section>
            </div>
          </main>
        </>
      )}
    </>
  );
};

export default AnimePage;
