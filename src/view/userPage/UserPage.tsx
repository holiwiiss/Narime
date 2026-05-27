import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./userPage.scss"
import { useMyAnimeList } from "../../context/MyListContext";
import type { AnimeCardType } from "../../services/anime-list/anime-list.type";
import { useQuery } from "@tanstack/react-query";
import AnimeCard from "../../components/animeCard/AnimeCard";
import { fetchMyFavoriteList } from "../../queries/user-page.query";
import { ModalAddFavorites } from "../../components/modals/ModalAddFavorite/ModalAddFavorite";
import { ModalRemoveFavorites } from "../../components/modals/ModalRemoveFavorite/ModalRemoveFavorite";
import LoadingComponent from "../../components/loading/LoadingComponent";
import ErrorComponent from "../../components/error/ErrorComponent";
import { useUserData } from "../../hooks/useUserData";
import { Navigate } from "react-router-dom";

const UserPage = () => {

  const { user } = useAuth()
  const { myList } = useMyAnimeList()
  const { isLoadingUser, isErrorUser, userData} = useUserData()
  
  const [isOpenAddFavorite, setIsOpenAddFavorite] = useState<boolean>(false)
  const [isOpenRemoveFavorite, setIsOpenRemoveFavorite] = useState<boolean>(false)

  const list = userData?.animeFavs ?? []

  const {isLoading: isLoadingFavorites, isError: isErrorFavorites, data: myFavoriteList = []} = useQuery({
    queryKey:["myFavoriteList", list],
    queryFn: () => fetchMyFavoriteList(list),
    enabled: list.length > 0,
  })

  if (!user) return <Navigate to="/login" replace />

  return(
  <>
    <section className="user-page__content">
    
    {isLoadingUser || !userData || !user ? (
      <LoadingComponent></LoadingComponent>
    ) : isErrorUser  ? (
      <ErrorComponent text="An error has ocurred"></ErrorComponent>
    ) : (
      <>
          <header className="user-page__header">
            <div className="user-page__header--banner">
              <button className="btn btn--secondary btn--small">Edit profile</button>
              <div className="user-page__social--info">
                <div className="user-page__social--item">
                  <p className="user-page__social--item--number">{userData.followersCount}</p>
                  <p className="user-page__social--item--text">followers</p>
                </div>
                <div className="user-page__social--item">
                  <p className="user-page__social--item--number">{userData.followingCount}</p>
                  <p className="user-page__social--item--text">following</p>
                </div>
                <div className="user-page__social--item">
                  <p className="user-page__social--item--number">{myList.length ?? 0}</p>
                  <p className="user-page__social--item--text">items in list</p>
                </div>
              </div>

              <div className="user-page__header--banner-img--container">
                <img className="banner-user--img" src={userData.avatar} alt={userData.avatar} />
              </div>
            </div>
            <div className="user-page__header-user-info">
              <h1>{userData.username}</h1>
              <p>{userData.description}</p>
            </div>
          </header>

          <div className="user-page__favorites-container">
            <div className="user-page__favorites--header">
              <h2>Your Favorites</h2>
              <button className="btn" onClick={() => setIsOpenRemoveFavorite(true)}>Edit favorites</button>
            </div>
              <div className="anime-favorites__container">
                {isLoadingFavorites ? (
                  <LoadingComponent></LoadingComponent>
                ) : isErrorFavorites ? (
                  <ErrorComponent text="An error has ocurred"></ErrorComponent>
                ) : (
                  <>
                    {myFavoriteList.map((anime: AnimeCardType) =>(
                    <AnimeCard
                      key={anime.id}
                      anime={anime}
                      variant="minimal"
                    >
                    </AnimeCard>
                    ))}
                    {myFavoriteList.length <= 4 && (
                      <button className="favorite--add_btn" onClick={() => setIsOpenAddFavorite(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white" className="size-6 icon-size-xl">
                          <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </>
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
    </section>
  </>);
};

export default UserPage;