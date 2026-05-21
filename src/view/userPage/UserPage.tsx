import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { addAnimeFavorite, getUserInformation, removeAnimeFavorite } from "../../firebase/services/user-information.firebase";
import "./userPage.scss"
import { useMyAnimeList } from "../../context/MyListContext";
import { delay } from "../../utils/delay";
import { getAnimeInformationTypeList } from "../../services/anime-information/anime-information";
import type { AnimeCardType, AnimeListResponse } from "../../services/anime-list/anime-list.type";
import { useQuery } from "@tanstack/react-query";
import AnimeCard from "../../components/animeCard/AnimeCard";
import { searchAnime } from "../../services/anime-search/anime-search";

const fetchMyFavoriteList = async (list: number[]) => {
  const results: AnimeCardType[] = [];
    
    for (const anime of list) {
      const data = await getAnimeInformationTypeList(anime);
      results.push(data);
      await delay(400); 
    }
    
    return results;
}

const UserPage = () => {

  const { user } = useAuth()
  const [userData, setUserData] = useState<any>(null)
  const {myList} = useMyAnimeList()
  const list = userData?.animeFavs ?? []
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [isOpenModal2, setIsOpenModal2] = useState<boolean>(false)

  const [inputValue, setInputValue] = useState("");
  const [searchList, setSearchList] = useState<AnimeCardType[]>([]);

  const {isLoading, isError, data} = useQuery({
    queryKey:["myFavoriteList", list],
    queryFn: () => fetchMyFavoriteList(list),
    enabled: list.length > 0,
  })

  const myFavoriteList: AnimeCardType[] = data ?? []

  useEffect(() => {
    if(!user) return
    const fetchUser = async () => {
      const dataFirebase = await getUserInformation(user.uid);

      if (dataFirebase) {
        setUserData(dataFirebase);
      }
    };
    fetchUser();

  },[user]);

  useEffect(() => {
    if (!inputValue) {
      setSearchList([]);
      return;
    }
  
    const timeout = setTimeout(async () => {
      setSearchList([])
      const query = encodeURIComponent(inputValue);
      try {
        const result: AnimeListResponse = await searchAnime(query, 1, 5);
        setSearchList(result.animes);
        console.log(searchList)
      } catch (e) {
        console.log("La api no responde, " + e);
      }finally{
      }
    }, 300);

    return () =>{clearTimeout(timeout);} 
  }, [inputValue]);

  const openFavModal = () => {
    setIsOpenModal(true)
  }
  const addToFavorite = async (animeId: number, userId: string) => {
    try{
      await addAnimeFavorite(animeId, userId)
    }catch{

    }finally{

    }
    setIsOpenModal(false)
  }
  const deleteToFavorite = async (animeId: number, userId: string) => {
    try{
      await removeAnimeFavorite(animeId, userId)
    }catch{

    }finally{

    }
    setIsOpenModal2(false)
  }
  const isInList = (animeId:number) =>{
    return list.includes(animeId)
  }


  return( <>
    {user && userData && (
      <>
        <h1>{userData.username}</h1>
        <img className="user__image" src={userData.avatar} alt={userData.avatar} />
        <p>{userData.description}</p>
        <div>
          <div>
            <p>{userData.followers ?? 0}</p>
            <p>followers</p>
          </div>
          <div>
            <p>{userData.following ?? 0}</p>
            <p>following</p>
          </div>
          <div>
            <p>{myList.length ?? 0}</p>
            <p>ítems in list</p>
          </div>
        </div>

        <div>
          <h2>Tus favoritos</h2>
          <button className="btn" onClick={() => setIsOpenModal2(true)}>Edit favorites</button>
            <div className="anime-cards__container">
              {myFavoriteList.map((anime: AnimeCardType) =>(
                <AnimeCard
                  key={anime.id}
                  anime={anime}
                  variant="minimal"
                >
                </AnimeCard>
              ))}
              {myFavoriteList.length <= 4 && (
                <div className="add_favorites" onClick={openFavModal}>
                  <img className="add__icon" src="#" />
                </div>
              )}
            </div>
        </div>
        
        {isOpenModal && (
          <div className="bg-popup" >
            <div className="popup__container">
              <h3>Añade a favoritos</h3>
              <input
                  type="text"
                  value={inputValue}
                  onInput={(event: React.InputEvent<HTMLInputElement>) =>
                    setInputValue(event.currentTarget.value)
                  }
                  placeholder="Search an anime..."
              ></input>
              <div >
                {isLoading ? (
                  <h1>cargando...</h1>
                ) : isError ? (
                  <h1>error ocurrido</h1>
                ): searchList.length === 0 ? (
                  <p>no se ha encontrado ningún anime con ese nombre</p>
                ):(
                  searchList.map((anime: AnimeCardType) => (
                    !isInList(anime.id) ? (
                      <div key={anime.id} className="anime-search__card" >
                      <img className="anime-search__card-img" src={anime.image} />
                      <p>{anime.title}</p>
                      <button className="btn" onClick={() => addToFavorite(anime.id, user.uid)}>Add to favorite</button>
                      </div>
                    ) : (
                      <div key={anime.id} className="anime-search__card" >
                      <img className="anime-search__card-img" src={anime.image} />
                      <p>{anime.title}</p>
                      <span>Ya esta en tus favoritos</span>
                      </div>
                    )
                  ))
                )}
                
              </div>

              <button className="btn btn--secondary" onClick={() => setIsOpenModal2(false)}>Close </button>   
            </div>
          </div>
        )} 

        {isOpenModal2 && (
          <div className="bg-popup" >
            <div className="popup__container">
              <h3>Edita tus favoritos</h3>
              <div >
                {myFavoriteList.map((anime: AnimeCardType) => (
                  <div key={anime.id} className="anime-search__card" >
                  <img className="anime-search__card-img" src={anime.image} />
                  <p>{anime.title}</p>
                  <button className="btn" onClick={() => deleteToFavorite(anime.id, user.uid)}>Delete to favorite</button>
                  </div>
                ))}
              </div>

              <button className="btn btn--secondary" onClick={() => setIsOpenModal(false)}>Close </button>   
            </div>
          </div>
        )}      
      </>
    )}
    
  </>);
};

export default UserPage;
