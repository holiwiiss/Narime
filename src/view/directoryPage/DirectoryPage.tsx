import "./directorypage.scss";
import type { AnimeCardType } from "../../services/anime-list/anime-list.type";
import LoadingComponent from "../../components/loading/LoadingComponent";
import ErrorComponent from "../../components/error/ErrorComponent";
import ModalAddEditAnime from "../../components/modalAddEditAnime/ModalAddEditAnime";
import AnimeCard from "../../components/animeCard/AnimeCard";
import { useSearchParams } from "react-router-dom";
import { useDirectoryAnimes } from "../../hooks/useDirectoryAnime";
import { useMyListMap } from "../../hooks/useMyListMap";
import { useAnimeModal } from "../../hooks/useAnimeModal";
import type { CategoryType } from "../../queries/directory.type";
import ParaTi from "../../components/paraTi/ParaTi";

const DirectoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = (searchParams.get("category") as CategoryType) ?? "top";

  const {isLoading, isError, animeList, fetchNextPage, hasNextPage} = useDirectoryAnimes(category)
  const  { getUserListData } = useMyListMap()
  const modalAddEdit = useAnimeModal();

  const activateFilter = (category: CategoryType) => {
    setSearchParams({category});
  }

  const openAddEditModal = (anime: AnimeCardType) => {
    const userData = getUserListData(anime.id);
    modalAddEdit.openModal(anime.id, anime.episodes, userData);
  };

  return (
    <>
    <section className="all-content-max">
      <div className="my-list__options tab__container">
        <div className="tab__buttons">
          <button className={`tab-option ${category === 'para ti' ? "tab-option__selected" : "tab-option__unselected"}`} onClick={() => activateFilter("para ti")}>For You</button>
          <button className={`tab-option ${category === 'top' ? "tab-option__selected" : "tab-option__unselected"}`}  onClick={() => activateFilter("top")}>Top anime</button>
          <button className={`tab-option ${category === 'trending' ? "tab-option__selected" : "tab-option__unselected"}`} onClick={() => activateFilter("trending")}>Trending</button>
          <button className={`tab-option ${category === 'seasonal' ? "tab-option__selected" : "tab-option__unselected"}`} onClick={() => activateFilter("seasonal")}>Seasonal</button>
          <button className={`tab-option ${category === 'upcoming' ? "tab-option__selected" : "tab-option__unselected"}`} onClick={() => activateFilter("upcoming")}>Upcoming</button>
        </div>
      </div>
      {category === "para ti" ? (
        <ParaTi />
      ) : animeList.length > 0 ? (
        <>
        <div className="anime-cards__container">
          {animeList.map((anime: AnimeCardType) => (
            <AnimeCard
              key={anime.id}
              anime={anime}
              userData={getUserListData(anime.id)}
              onOpenModal={() => openAddEditModal(anime)}
              variant={category === 'upcoming' ? "upcoming" : "directory"}
            />
          ))}
        </div>
        {hasNextPage && (
          <div className="directory--btn__container">
            <button className="btn" onClick={() => fetchNextPage ()}>Load more anime</button>
          </div>
          )}
        </>
      ): isLoading ? (
        <div className="container--chargin">
          <LoadingComponent />
        </div>
      ): !isLoading && isError ? (
        <ErrorComponent text="Something went wrong" />
      ) : !isLoading && animeList.length === 0 ? (
        <h1>(⁠╥⁠﹏⁠╥⁠)</h1>
      ) : (
        <h1>No anime found</h1>
      )}

      {modalAddEdit.isOpen && modalAddEdit.animeId &&(
          <ModalAddEditAnime
          animeId={modalAddEdit.animeId}
          totalEpisodes = {modalAddEdit.animeEpisodes}
          action={modalAddEdit.action}
          infoDocIdUserAnime = {modalAddEdit.infoDocIdFromUser}
          onClose={modalAddEdit.closeModal}
          />
      )}
      </section>
    </>
  );
};

export default DirectoryPage;