import { useEffect, useState } from "react";
import "./animepage.scss";
import type { AnimeCharactersType, AnimeInformationType } from "../../services/anime-information/anime-information.type";
import { useParams } from "react-router-dom";
import { getAnimeCharacters, getAnimeInformation } from "../../services/anime-information/anime-information";
import ErrorComponent from "../../components/error/ErrorComponent";
import LoadingComponent from "../../components/loading/LoadingComponent";

const AnimePage = () => {
  const [animeInfo, setAnimeInfo] = useState<AnimeInformationType | null>(null);
  const [animeCharacters, setAnimeCharacters] = useState<AnimeCharactersType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<string | null>(null)
  
  const { id } = useParams();
  const animeID = Number(id);

  useEffect(() => {

    if(!id || isNaN(animeID)) {
      setIsError('El id del anime no es válido')
      setIsLoading(false)
      return
    }

    const fetchAnimes = async () => {
      setIsLoading(true)
      setIsError(null)
      try {
        const JSON: AnimeInformationType = await getAnimeInformation(animeID);
        setAnimeInfo(JSON);

        const JSONCharacters: AnimeCharactersType[] = await getAnimeCharacters(animeID);
        setAnimeCharacters(JSONCharacters);
      } catch (e) {
        console.log("La api no responde " + e);
        setIsError('Ha habido un error con la carga de la API')
      }finally{
        setIsLoading(false)
      }
    };
    fetchAnimes();
  }, [animeID]);

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
            </header>

            <section className="anime-page__content">
              <div className="anime-page__content-info">
                <h1>{animeInfo.title}</h1>
                <h2 className="anime-page__content-info-tittle-english"><i>{animeInfo.titleEnglish}</i></h2>
                <p className="anime-page__content-info-date"><i>{animeInfo.aired[0]} - {animeInfo.aired[1]}</i></p>

                <div className="anime-page__content-stats">
                  <div className="anime-page__content-stat">
                    <p className="anime-page__content-stat-number">{animeInfo.score}</p>
                    <p>Global Score</p>
                  </div>

                  <div className="anime-page__content-stat">
                    <p className="anime-page__content-stat-number"># {animeInfo.rank}</p>
                    <p>Ranked</p>
                  </div>

                  <div className="anime-page__content-stat">
                    <p className="anime-page__content-stat-number">{animeInfo.members}</p>
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
              
              <div className="anime-page__content-synopsis">
                  <p>{animeInfo.synopsis}</p>
              </div>
            </section>
            </div>
          </main>
          
          {animeCharacters.map((person: AnimeCharactersType) => (
                    <div className="container__character">
                      <p>{person.characterName}</p>
                      <img src={person.characterImage} />
                      <p>{person.role}</p>
                      <p>{person.voiceActorName}</p>
                      <img src={person.voiceActorImage} />
                    </div>
                  ))}
        </>
      )}
    </>
  );
};

export default AnimePage;
