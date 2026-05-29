import { useState } from "react"
import { getAnimeGenres } from "../../services/anime-genres/anime-genres"
import { useInfiniteQuery, useQuery, type InfiniteData, type QueryFunctionContext } from "@tanstack/react-query"
import type { AnimeCardType, AnimeListResponse } from "../../services/anime-list/anime-list.type"
import { discoverAnime } from "../../services/anime-search/anime-search"
import CustomSelect from "../../components/CustomSelect/CustomSelect"
import LoadingComponent from "../../components/Loading/LoadingComponent"
import ErrorComponent from "../../components/Error/ErrorComponent"
import AnimeCard from "../../components/AnimeCard/AnimeCard"
import { useAnimeModal } from "../../hooks/useAnimeModal"
import { useMyListMap } from "../../hooks/useMyListMap"
import ModalAddEditAnime from "../../components/modals/ModalAddEditAnime/ModalAddEditAnime"
import type { AnimeGenreType } from "../../services/anime-genres/anime-genre.type"

type filtersType = {
  genre: AnimeGenreType | null, 
  type:string | null,
  score:number | null, 
  order:string | null, 
  status: string | null, 
}
export const fecthAnimesDiscover = async ({pageParam, queryKey}: QueryFunctionContext <[string, filtersType], number>) => {
  const [, filterParam] = queryKey
  const data:AnimeListResponse = await discoverAnime(filterParam.genre?.id ?? null, filterParam.type, filterParam.score, filterParam.order, filterParam.status, pageParam)
  const currentPage = data.pagination.currentPage
  const nextPage = currentPage >= data.pagination.lastVisiblePage ? undefined : currentPage + 1

  return {
    animes: data.animes,
    nextPage: nextPage,
  }
}

const DiscoverPage = () => {
  const  { getUserListData } = useMyListMap()
  const modalAddEdit = useAnimeModal();

  const [filters, setFilters] = useState<filtersType>({
    genre: null,
    type: null,
    score: null,
    order: null,
    status: null,
  })
  
  const { data: genresList = [] } = useQuery({
    queryKey: ["animeGenres"],
    queryFn: getAnimeGenres,
  })

  const {isLoading: isLoadingAnimes, isError:isErrorAnimes, data: discoverList, fetchNextPage, hasNextPage } =
    useInfiniteQuery<
      { animes: AnimeCardType[]; nextPage?: number },
      Error,
      InfiniteData<{ animes: AnimeCardType[]; nextPage?: number }>,
      [string, filtersType],
      number
    >({
      queryKey: ["discoverList", filters],
      queryFn: fecthAnimesDiscover,
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: 1,
    })

    const list = discoverList?.pages?.flatMap(page => page.animes) ?? []
    console.log("list", list)
    console.log("genresList", genresList)
    const openAddEditModal = (anime: AnimeCardType) => {
      const userData = getUserListData(anime.id);
      modalAddEdit.openModal(anime.id, anime.episodes, anime.title, userData);
    };
  return (
    <>
      <h1>Discover</h1>
      <CustomSelect
        options={genresList.map(genre => genre.name)}
        value={filters.genre?.name ?? ""}
        onChange={(value) => {
          const genre = genresList.find(g => g.name === value)
          setFilters(prev => ({
            ...prev,
            genre: genre
              ? { id: genre.id, name: genre.name }
              : null
          }))
        }}
          
      ></CustomSelect>

      {isLoadingAnimes ? (
        <LoadingComponent></LoadingComponent>
      ) : !isLoadingAnimes && isErrorAnimes ? (
        <ErrorComponent text="Something went wrong"/>
      ): list.length > 0 ? (
        <>
        <div className="anime-cards__container">
          {list.map((anime:AnimeCardType ) => (
            <AnimeCard
              key={anime.id}
              anime={anime}
              userData={getUserListData(anime.id)}
              onOpenModal={() => openAddEditModal(anime)}
              fromState={{ from: "/discover", label: "Discover" }}
            />
          ))}
        </div>
        {hasNextPage && (
          <div className="directory--btn__container">
            <button className="btn" onClick={() => fetchNextPage ()}>Load more anime</button>
          </div>
          )}
          </>
      ):(
        <h1>error cini</h1>
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
    </>
  )
}

export default DiscoverPage