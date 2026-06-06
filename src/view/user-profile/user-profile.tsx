import { useState } from "react";
import "./user-profile.scss"
import type { AnimeCardType } from "../../services/anime-list/anime-list.type";
import { useQuery } from "@tanstack/react-query";
import AnimeCard from "../../components/anime-card/anime-card";
import { fetchMyFavoriteList } from "../../queries/user-page.query";
import { ModalAddFavorites } from "../../components/modals/modal-add-favorite";
import { ModalRemoveFavorites } from "../../components/modals/modal-remove-favorite";
import LoadingComponent from "../../components/loading-component/loading-component";
import ErrorComponent from "../../components/error-component/error-component";
import { useUserData } from "../../hooks/use-user-data";
import { Link, Navigate } from "react-router-dom";
import { useMyListStats } from "../../hooks/use-my-list-stats";
import StatsCircle from "../../components/stats-circle/stats-circle";
import { useMyAnimeList } from "../../hooks/use-my-list";
import { useAuth } from "../../hooks/use-auth";

const UserPage = () => {

  const { user } = useAuth()
  const { myList } = useMyAnimeList()
  const { stats } = useMyListStats()
  const { isLoadingUser, isErrorUser, userData} = useUserData()
  
  const [isOpenAddFavorite, setIsOpenAddFavorite] = useState<boolean>(false)
  const [isOpenRemoveFavorite, setIsOpenRemoveFavorite] = useState<boolean>(false)

  const [category, setCategory] = useState<"stats" | "favorites">("stats")

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
      <LoadingComponent/>
    ) : isErrorUser  ? (
      <ErrorComponent text="An error has ocurred"></ErrorComponent>
    ) : (
      <>
        <div className="user-page__banner">
          <img className="user-page__avatar" src={userData.avatar} alt={userData.avatar} />
        </div>

          <header className="user-page__header">
            <div className="user-page__edit">
              <h1 className="text-h1">{userData.username}</h1>
              <Link to="/settings-user" className="btn btn--secondary btn--small">Edit profile</Link>
            </div>
            <p className="text-p text-color--75 user-page__biography">{userData.description}</p>

            <div className="user-page__social-stats">
                <div className="user-page__social-stats-item">
                  <p className="text-h1">{userData.followersCount}</p>
                  <p className="text-details text-color--75">followers</p>
                </div>
                <div className="user-page__social-stats-item">
                  <p className="text-h1">{userData.followingCount}</p>
                  <p className="text-details text-color--75">following</p>
                </div>
                <div className="user-page__social-stats-item">
                  <p className="text-h1">{myList.length ?? 0}</p>
                  <p className="text-details text-color--75">items in list</p>
                </div>
            </div>
          </header>

          <div className="my-list__options tab__container user-page__tab">
            <div className="tab__buttons">
              <button className={`text-p tab-option ${category === 'stats' ? "tab-option__selected" : "tab-option__unselected"}`} onClick={() => setCategory("stats")}>Stats</button>
              <button className={`text-p tab-option ${category === 'favorites' ? "tab-option__selected" : "tab-option__unselected"}`}  onClick={() => setCategory("favorites")}>Favorites</button>
            </div>
          </div>

          <div className="user-page__content-area">
            {category === "stats" ? (

              <div className="user-page__stats-grid">

                <div className="user-page__stats-grid-line">
                  <div className="stats-card">
                    <p className="text-p text-color--75">Watched Episodes</p>
                    <p className="text-h1">{stats.episodesWatched}</p>
                    <p className="text-details text-color--50">In {stats.total} animes</p>
                  </div>
                  
                  <div className="stats-card">
                    <p className="text-p text-color--75">Time watched</p>
                    <p className="text-h1">{(stats.timeInHours).toFixed(2)} hours</p>
                    <p className="text-details text-color--50">= {(stats.timeInDays).toFixed(2)} days</p>
                  </div>

                  <div className="stats-card">
                    <p className="text-p text-color--75">Score medium</p>
                    <p className="text-h1">{stats.scoreMedia} / 10</p>
                    <p className="text-details text-color--50">in all the animes</p>
                  </div>

                  <div className="stats-card">
                    <p className="text-p text-color--75">Watched Anime Films</p>
                    <p className="text-h1">15</p>
                    <p className="text-details text-color--50">In {stats.total} animes</p>
                  </div>
                </div>

                <div className="user-page__stats-grid-line">
                  <div className="stats-card">
                    <StatsCircle/>
                  </div>

                  <div className="stats-card">
                    <p className="text-p text-color--75">Your better scored anime is</p>
                    <p className="text-h1">FullMetal Alchemist: Brotherhood</p>
                    <p className="text-details text-color--50">In {stats.total} animes</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="user-page__favorites">
                <header className="user-page__favorites-header">
                  <h2 className="text-h2">Your Favorites</h2>
                  <button className="btn" onClick={() => setIsOpenRemoveFavorite(true)}>Edit favorites</button>
                </header>
                <div className="user-page__favorites-grid">
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
                        <button className="favorite-add-btn" onClick={() => setIsOpenAddFavorite(true)}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white" className="size-6 icon-size-xl">
                            <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </>
                  )}
                </div>
            </div>
            )}
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