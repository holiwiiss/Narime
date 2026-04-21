import { useEffect, useState } from "react";
import "./animepage.scss";
import type { AnimeCharactersType, AnimeInformationType } from "../../services/anime-information/anime-information.type";
import { useParams } from "react-router-dom";
import { getAnimeCharacters, getAnimeInformation } from "../../services/anime-information/anime-information";
import ErrorComponent from "../../components/error/ErrorComponent";
import LoadingComponent from "../../components/loading/LoadingComponent";

const AnimePage = () => {
  const [animeInfo, setAnimeInfo] = useState<AnimeInformationType>();
  const [animeCharacters, setAnimeCharacters] = useState<AnimeCharactersType[]>([]);
  const { id } = useParams();
  const animeID = Number(id);

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<string | null>(null)

  useEffect(() => {
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
          <h1>{animeInfo.title}</h1>
          <h2>{animeInfo.titleEnglish}</h2>
          <p>{animeInfo.type}</p>
          <img src={animeInfo.images}></img>
          <p>
            {animeInfo.aired[0]} - {animeInfo.aired[1]}
          </p>
          <p>score: {animeInfo.score}</p>
          <p>rank: {animeInfo.rank}</p>
          <p>viewers: {animeInfo.members}</p>
          <p>
            {animeInfo.season} {animeInfo.year}
          </p>
          <p>{animeInfo.genres.map((g) => g)}</p>
          <p>{animeInfo.studios.map((s) => s)}</p>
          <p>{animeInfo.synopsis}</p>

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
