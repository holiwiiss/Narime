import { createContext, useContext, useState, type ReactNode } from "react";

type MyListContextType = {
  animes: number[];
  addAnimeToMyList: (id: number) => void;
};

type ProviderProps = {
  children: ReactNode;
};

const MyListContext = createContext<MyListContextType | undefined>(undefined);

export function MyListProvider({children}: ProviderProps) {
    const [animes, setAnimes] = useState<number[]>([]);

    const addAnimeToMyList = (id:number) => {
        if(animes.includes(id)){
            return
        }
        setAnimes(prev => [...prev, id]);
    }

    return (
        <MyListContext.Provider value={{animes, addAnimeToMyList}}>
            {children}
        </MyListContext.Provider>
    )
}

export function useAddAnimeList() {
    const context = useContext(MyListContext);
    if(!context){
        throw new Error("useAddAnimeList must be used inside MyListProvider");
    }
    return context
}