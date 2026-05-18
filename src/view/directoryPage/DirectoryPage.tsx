import "./directorypage.scss";
import type { AnimeListResponse, AnimeCardType } from "../../services/anime-list/anime-list.type";
import { getSeasonalAnimes, getTopAnime, getTrendingAnimes } from "../../services/anime-list/anime-list";
import LoadingComponent from "../../components/loading/LoadingComponent";
import ErrorComponent from "../../components/error/ErrorComponent";
import ModalAddEditAnime from "../../components/modalAddEditAnime/ModalAddEditAnime";
import AnimeCard from "../../components/animeCard/AnimeCard";
import { useAnimeModal } from "../../hooks/useAnimeModal";
import { useMyListMap } from "../../hooks/useMyListMap";
import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery, type QueryFunctionContext, type InfiniteData} from "@tanstack/react-query";

const functionMap = {
  top: getTopAnime,
  trending: getTrendingAnimes,
  seasonal: getSeasonalAnimes,
}
type CategoryType = "top" | "trending" | "seasonal";

const fecthAnimes = async ({pageParam, queryKey}: QueryFunctionContext<[string, CategoryType], number>) => {
  //['animeList', categoryParam]
  const [, categoryParam] = queryKey
  
  const searchFunction = functionMap[categoryParam]
  const data: AnimeListResponse = await searchFunction(pageParam)

  const currentPage = data.pagination.currentPage
  const nextPage = currentPage >= data.pagination.lastVisiblePage ? undefined : currentPage + 1

  return {
    animes: data.animes,
    nextPage: nextPage,
  }
}

const DirectoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = (searchParams.get("category") as CategoryType) ?? "top";

  const {isLoading, isError, data, fetchNextPage, hasNextPage } = useInfiniteQuery< // Los genericos de React Query son: <TQueryFnData, TError, TData, TQueryKey>
    { animes: AnimeCardType[]; nextPage?: number },                                 // lo que devuelve queryFn
    Error,                                                                          // tipo de error
    InfiniteData<{ animes: AnimeCardType[]; nextPage?: number }>,                   // data transformada (igual)
    [string, CategoryType],                                                          // forma del queryKey
    number               
  >({
    queryKey: ['animeList', category], 
    queryFn: fecthAnimes,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  })
  
  const animeList:AnimeCardType[] = data?.pages?.flatMap(page => page.animes) ?? []

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