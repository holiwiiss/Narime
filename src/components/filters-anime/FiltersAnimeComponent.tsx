import { useEffect, useState } from "react";
import type { AnimeGenresType } from "../../services/anime-genres/anime-genres.type";
import { getAnimeGenres } from "../../services/anime-genres/anime-genres";

const FiltersAnime = () => {
  const [selected, setSelected] = useState("");
  const [genresList, setGenresList] = useState<AnimeGenresType[]>([]);
  const yearList = [
    2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015,
    2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003,
    2002, 2001, 2000, 1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991,
    1990,
  ];
  const typeList = ["tv", "movie", "ova", "special", "ona"];

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const JSONGenres: AnimeGenresType[] = await getAnimeGenres();
        setGenresList(JSONGenres);
      } catch (err) {
        console.log("La api no responde," + err);
      }
    };
    loadGenres();
  }, []);

  return (
    <>
      <select value={selected} onChange={(e) => setSelected(e.target.value)}>
        <option value="">Genre</option>

        {genresList.map((genre) => (
          <option value={genre.name}>{genre.name}</option>
        ))}
      </select>

      <select value={selected} onChange={(e) => setSelected(e.target.value)}>
        <option value="">Year</option>

        {yearList.map((year) => (
          <option value={year}>{year}</option>
        ))}
      </select>

      <select value={selected} onChange={(e) => setSelected(e.target.value)}>
        <option value="">Type</option>

        {typeList.map((type) => (
          <option value={type}>{type}</option>
        ))}
      </select>
    </>
  );
};

export default FiltersAnime;
