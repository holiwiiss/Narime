import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserInformation } from "../../firebase/services/user-information.firebase";
import "./userPage.scss"
import { useMyAnimeList } from "../../context/MyListContext";
import type { AnimeCardType } from "../../services/anime-list/anime-list.type";
import { useQuery } from "@tanstack/react-query";
import AnimeCard from "../../components/animeCard/AnimeCard";
import { fetchMyFavoriteList } from "../../queries/user-page.query";
import { ModalAddFavorites } from "../../components/modals/ModalAddFavorite/ModalAddFavorite";
import { ModalRemoveFavorites } from "../../components/modals/ModalRemoveFavorite/ModalRemoveFavorite";

const UserPage = () => {

  const { user } = useAuth()
  const {myList} = useMyAnimeList()
  
  const [isOpenAddFavorite, setIsOpenAddFavorite] = useState<boolean>(false)
  const [isOpenRemoveFavorite, setIsOpenRemoveFavorite] = useState<boolean>(false)

  const {isLoading: isLoadingUser, isError: isErrorUser, data: userData = null} = useQuery({
    queryKey: ["userData", user?.uid],
    queryFn: () => getUserInformation(user!.uid),
    enabled: !!user,
  })

  const list = userData?.animeFavs ?? []

  const {isLoading: isLoadingFavorites, isError: isErrorFavorites, data: myFavoriteList = []} = useQuery({
    queryKey:["myFavoriteList", list],
    queryFn: () => fetchMyFavoriteList(list),
    enabled: list.length > 0,
  })

  return( <>
    {user && userData && (
      <>
        <h1>{userData.username}</h1>
        <img className="user__image" src={userData.avatar} alt={userData.avatar} />
        <p>{userData.description}</p>
        <div>
          <div>
            <p>{userData.followersCount}</p>
            <p>followers</p>
          </div>
          <div>
            <p>{userData.followingCount}</p>
            <p>following</p>
          </div>
          <div>
            <p>{myList.length ?? 0}</p>
            <p>ítems in list</p>
          </div>
        </div>

        <div>
          <h2>Tus favoritos</h2>
          <button className="btn" onClick={() => setIsOpenRemoveFavorite(true)}>Edit favorites</button>
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
                <div className="add_favorites" onClick={() => setIsOpenAddFavorite(true)}>
                  <img className="add__icon" src="#" />
                </div>
              )}
            </div>
        </div>
        
        {isOpenAddFavorite && (
          <ModalAddFavorites
            listFavoriteId = {list}
            userId={user.uid}
            onClose={() => setIsOpenAddFavorite(false)}
          ></ModalAddFavorites>
        )} 

        {isOpenRemoveFavorite && (
          <ModalRemoveFavorites
            listFavoriteInformation={myFavoriteList}
            userId={user.uid}
            onClose={() => setIsOpenRemoveFavorite(false)}
          >
          </ModalRemoveFavorites>
        )}      
      </>
    )}
    
  </>);
};

export default UserPage;
