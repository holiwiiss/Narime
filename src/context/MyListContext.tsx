import { createContext, useContext, useState, type ReactNode } from "react";

type ContentList = {
  animeID: number;
  animeStatus: string;
  animeScore: number | null;
  animeEpisodes: number;
};

type MyListContextType = {
  animes: ContentList[];
  addAnimeToMyList: (
    id: number,
    status: string,
    score: number | null,
    episodes: number,
  ) => void;
};

type ProviderProps = {
  children: ReactNode;
};

const MyListContext = createContext<MyListContextType | undefined>(undefined);

export function MyListProvider({ children }: ProviderProps) {
  const [animes, setAnimes] = useState<ContentList[]>([]);

  const addAnimeToMyList = (id: number, status: string, score: number | null, episodes: number) => {
    const exists = animes.some((anime) => anime.animeID === id);
    if (exists) return;

    setAnimes((prev) => [
      ...prev,
      {
        animeID: id,
        animeStatus: status,
        animeScore: score,
        animeEpisodes: episodes,
      },
    ]);
  };

  return (
    <MyListContext.Provider value={{ animes, addAnimeToMyList }}>
      {children}
    </MyListContext.Provider>
  );
}

export function useAddAnimeList() {
  const context = useContext(MyListContext);
  if (!context) {
    throw new Error("Algo estas haciendo mal");
  }
  return context;
}
