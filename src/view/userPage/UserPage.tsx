import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserInformation } from "../../firebase/services/user-information.firebase";
import "./userPage.scss"
import { useMyAnimeList } from "../../context/MyListContext";
import { delay } from "../../utils/delay";
import { getAnimeInformationTypeList } from "../../services/anime-information/anime-information";
import type { AnimeCardType } from "../../services/anime-list/anime-list.type";
import { useQuery } from "@tanstack/react-query";
import AnimeCard from "../../components/animeCard/AnimeCard";

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

  const openFavModal = () => {
    setIsOpenModal(true)
  }


  return( <>
    {userData && (
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
            <div className="anime-cards__container">
              {myFavoriteList.map((anime: AnimeCardType) =>(
                <AnimeCard
                  key={anime.id}
                  anime={anime}
                  variant="minimal"
                >
                </AnimeCard>
              ))}
              {myFavoriteList.length <= 3 && (
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
              
              <button className="btn btn--secondary" onClick={() => setIsOpenModal(false)}>Close </button>   
            </div>
          </div>
        )}      
      </>
    )}
    
  </>);
};

export default UserPage;
