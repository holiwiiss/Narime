import "./directorypage.scss";
import type { AnimeCardType } from "../../services/anime-list/anime-list.type";
import LoadingComponent from "../../components/loading/LoadingComponent";
import ErrorComponent from "../../components/error/ErrorComponent";
import AnimeCard from "../../components/AnimeCard2/AnimeCard";
import { useSearchParams } from "react-router-dom";
import { useDirectoryAnimes } from "../../hooks/useDirectoryAnime";
import { useMyListMap } from "../../hooks/useMyListMap";
import { useAnimeModal } from "../../hooks/useAnimeModal";
import type { CategoryType } from "../../queries/directory.type";
import ModalAddEditAnime from "../../components/modals/ModalAddEditAnime/ModalAddEditAnime";
import ForYou from "../../components/ForYou/ForYou";

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
    modalAddEdit.openModal(anime.id, anime.episodes, anime.title, userData);
  };

  return (
    <>
    <section className="content-max" aria-labelledby="directory-title">
      <h1 id="directory-title" className="visually-hidden">Directory Anime</h1> 

      <nav className="my-list__options tab__container" aria-label="Category filters">
        <div className="tab__buttons" role="tablist">
          <button className={`text-p tab-option ${category === 'para ti' ? "tab-option__selected" : "tab-option__unselected"}`} onClick={() => activateFilter("para ti")}>For You</button>
          <button className={`text-p tab-option ${category === 'top' ? "tab-option__selected" : "tab-option__unselected"}`}  onClick={() => activateFilter("top")}>Top anime</button>
          <button className={`text-p tab-option ${category === 'trending' ? "tab-option__selected" : "tab-option__unselected"}`} onClick={() => activateFilter("trending")}>Trending</button>
          <button className={`text-p tab-option ${category === 'seasonal' ? "tab-option__selected" : "tab-option__unselected"}`} onClick={() => activateFilter("seasonal")}>Seasonal</button>
          <button className={`text-p tab-option ${category === 'upcoming' ? "tab-option__selected" : "tab-option__unselected"}`} onClick={() => activateFilter("upcoming")}>Upcoming</button>
        </div>
      </nav>
      {category === "para ti" ? (
        <ForYou />
      ) : animeList.length > 0 ? (
        <>
        <ul className="cards__grid">
          {animeList.map((anime: AnimeCardType) => (
            <AnimeCard
              key={anime.id}
              anime={anime}
              userData={getUserListData(anime.id)}
              onOpenModal={() => openAddEditModal(anime)}
              variant={category === 'upcoming' ? "upcoming" : "directory"}
              fromState={{ from: "/", label: "Directory" }}
            />
          ))}
        </ul>
        {hasNextPage && (
          <div className="cards__load-more">
            <button className="btn" onClick={() => fetchNextPage ()} aria-label="Load more anime">Load more anime</button>
          </div>
          )}
        </>
      ): isLoading ? (
        <LoadingComponent />
      ): !isLoading && isError ? (
        <ErrorComponent text="Something went wrong" button={{ label: "Try again", action:{ type: "reload" }}} />
      ) : !isLoading && !isError && animeList.length === 0 ? (
        <ErrorComponent text="Something went wrong" button={{ label: "Try again", action:{ type: "reload" }}} />
      ) : (
        <ErrorComponent text="Something went wrong" button={{ label: "Try again", action:{ type: "reload" }}} />
      )}

      {modalAddEdit.isOpen && modalAddEdit.animeId &&(
          <ModalAddEditAnime
          animeId={modalAddEdit.animeId}
          totalEpisodes = {modalAddEdit.animeEpisodes}
          animeTitle={modalAddEdit.animeTitle}
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