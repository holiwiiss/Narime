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
    <div className="directory__options">
      <div className="directory__options-buttons">
        <button className={`btn ${category === 'top' ? "" : "btn--disable"}`}  onClick={() => activateFilter("top")}>TOP ANIMES</button>
        <button className={`btn ${category === 'trending' ? "" : "btn--disable"}`} onClick={() => activateFilter("trending")}>TRENDING</button>
        <button className={`btn ${category === 'seasonal' ? "" : "btn--disable"}`} onClick={() => activateFilter("seasonal")}>SEASONAL</button>
      </div>
    </div>

    {animeList.length > 0 ? (
      <>
      <div className="anime-cards__container">
        {animeList.map((anime: AnimeCardType) => (
          <AnimeCard
            key={anime.id}
            anime={anime}
            userData={getUserListData(anime.id)}
            onOpenModal={() => openAddEditModal(anime)}
          />
        ))}
      </div>
      {hasNextPage && (
        <div className="directory--btn__container">
          <button className="btn" onClick={() => fetchNextPage ()}>Cargar más animes</button>
        </div>
        )}
      </>
    ): isLoading ? (
      <LoadingComponent text="Cargando animes..." />
    ): !isLoading && isError ? (
      <ErrorComponent text="Ha habido un error con la API" />
    ) : !isLoading && animeList.length === 0 ? (
      <h1>(⁠╥⁠﹏⁠╥⁠)</h1>
    ) : (
      <h1>hola</h1>
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
    </>
  );
};

export default DirectoryPage;