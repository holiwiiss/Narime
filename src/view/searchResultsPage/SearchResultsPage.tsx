import { useSearchParams } from "react-router-dom";
import { useMyListMap } from "../../hooks/useMyListMap";
import AnimeCard from "../../components/animeCard/AnimeCard";
import type { AnimeCardType } from "../../services/anime-list/anime-list.type";
import ModalAddEditAnime from "../../components/modalAddEditAnime/ModalAddEditAnime";
import { useAnimeModal } from "../../hooks/useAnimeModal";
import "./searchResultsPage.scss"
import { useSearchAnimes } from "../../hooks/useSearchAnime";
import LoadingComponent from "../../components/loading/LoadingComponent";
import ErrorComponent from "../../components/error/ErrorComponent";

const SearchResultsPage = () => {

  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  
  const modalAddEdit = useAnimeModal();
  const  { getUserListData } = useMyListMap()
  const {isLoading, isError, searchList, fetchNextPage, hasNextPage} = useSearchAnimes(query ?? "")

  const openAddEditModal = (anime: AnimeCardType) => {
    const userData = getUserListData(anime.id);
    modalAddEdit.openModal(anime.id, anime.episodes, anime.title,userData);
  };

  return (
    <>
    <div className="all-content-max">
      <h1 className="text-h1 search-page__title">Here are your search results...</h1>

      {isLoading ? (
        <LoadingComponent />
      ) : !isLoading && isError ? (
        <ErrorComponent text="Something went wrong"/>
      ) : searchList.length === 0 ? (
        <ErrorComponent text="No anime found with that name..." />
      ) : (
        <div className="anime-cards__container">
          {searchList.map((anime: AnimeCardType) => (
            <AnimeCard
              key={anime.id}
              anime={anime}
              userData={getUserListData(anime.id)}
              onOpenModal={() => openAddEditModal(anime)}
            >
            </AnimeCard>
          ))}
        </div>
      )}
      
      {hasNextPage && (
        <div className="directory--btn__container">
          <button className="btn" onClick={() => fetchNextPage ()}>Load more anime</button>
        </div>
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
      </div>
    </>
  );
};

export default SearchResultsPage;