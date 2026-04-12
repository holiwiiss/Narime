import { useEffect, useState } from "react";
import "./animepage.scss";
import { getAnimeCharacters, getAnimeInformation } from "../../api/animeInformation";
import type { AnimeCharactersType, AnimeInformationType } from "../../types/api/animeInformationTyping";
import { useParams } from "react-router-dom";

const AnimePage = () => {
  const [animeInfo, setAnimeInfo] = useState<AnimeInformationType>();
  const [animeCharacters, setAnimeCharacters] = useState<AnimeCharactersType[]>([]);
  const { id } = useParams();
  const animeID = Number(id);

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        const JSON: AnimeInformationType = await getAnimeInformation(animeID);
        setAnimeInfo(JSON);

        const JSONCharacters: AnimeCharactersType[] = await getAnimeCharacters(animeID);
        setAnimeCharacters(JSONCharacters);
      } catch (err) {
        console.log("La api no responde");
        console.log(err);
      }
    };
    fetchAnimes();
  }, [animeID]);

  return (
    <>
      {!animeInfo ? (
        <h1>no hay anime</h1>
      ) : (
        <>
          <h1>{animeInfo.title}</h1>
          <h2>{animeInfo.title_english}</h2>
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
              <p>{person.character_name}</p>
              <img src={person.character_image} />
              <p>{person.role}</p>
              <p>{person.voice_actor_name}</p>
              <img src={person.voice_actor_image} />
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default AnimePage;
