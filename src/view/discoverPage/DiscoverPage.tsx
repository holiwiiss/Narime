import { useState } from "react"
import { getAnimeGenres } from "../../services/anime-genres/anime-genres"
import { useInfiniteQuery, useQuery, type InfiniteData, type QueryFunctionContext } from "@tanstack/react-query"
import type { AnimeCardType, AnimeListResponse } from "../../services/anime-list/anime-list.type"
import { discoverAnime } from "../../services/anime-search/anime-search"
import CustomSelect from "../../components/CustomSelect/CustomSelect"
import LoadingComponent from "../../components/loading/LoadingComponent"
import ErrorComponent from "../../components/error/ErrorComponent"
import AnimeCard from "../../components/animeCard/AnimeCard"
import { useAnimeModal } from "../../hooks/useAnimeModal"
import { useMyListMap } from "../../hooks/useMyListMap"
import ModalAddEditAnime from "../../components/modals/ModalAddEditAnime/ModalAddEditAnime"
import type { AnimeGenreType } from "../../services/anime-genres/anime-genre.type"
import "./discoverPage.scss"

type filtersType = {
  genre: AnimeGenreType | null, 
  type:string | null,
  score: number | null, 
  sort: string | null
  order:string | null, 
  status: string | null, 
}
export const fecthAnimesDiscover = async ({pageParam, queryKey}: QueryFunctionContext <[string, filtersType], number>) => {
  const [, filterParam] = queryKey
  const data:AnimeListResponse = await discoverAnime(filterParam.genre?.id ?? null, filterParam.type, filterParam.score,filterParam.sort, filterParam.order, filterParam.status, pageParam)
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
  const typeList = ["TV", "OVA", "Movie", "Special", "ONA"]
  const statusList = ["airing", "complete", "upcoming"]
  const scoreList = [ 9, 8, 7, 6, 5, 4, 3 , 2 , 1, 0]
  const sortList = ["asc", "desc"]

  const [filters, setFilters] = useState<filtersType>({
    genre: null,
    type: null,
    score: null,
    order: null,
    status: null,
    sort: null,
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
    const openAddEditModal = (anime: AnimeCardType) => {
      const userData = getUserListData(anime.id);
      modalAddEdit.openModal(anime.id, anime.episodes, anime.title, userData);
    };

  return (
    <div className="all-content-max">
    <div className="header-discover">
      <h1 className="text-h1">Discover</h1>

      <div className="filters-content">
        <CustomSelect
          options={typeList}
          value={filters.type ?? ""}
          onChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}
          onReset={() => setFilters((prev) => ({ ...prev, type: null }))}
          containerWidth= {"125px"}
          firstValue="Type"
        ></CustomSelect>

        <CustomSelect
          options={statusList}
          value={filters.status ?? ""}
          onChange={(value) => {
            setFilters((prev) =>({ ...prev, status: value }))
            if(value==="upcoming"){
              setFilters((prev) =>({ ...prev, score: 0 }))
            }else {
              setFilters((prev) =>({ ...prev, score: null }))
            }
          }}
          
          onReset={() => setFilters((prev) => ({ ...prev, status: null, score: null }))}
          containerWidth= {"150px"}
          firstValue="Status"
        ></CustomSelect>

        <CustomSelect
          options={sortList}
          value={filters.sort ?? ""}
          onChange={(value) => setFilters((prev) => ({ ...prev, sort: value }))}
          onReset={() => setFilters((prev) => ({ ...prev, sort: null }))}
          containerWidth= {"125px"}
          firstValue="Order"
        ></CustomSelect>
        
        {filters.status==="upcoming" ? (
          <></>
        ):(
          <CustomSelect
            options={scoreList}
            value={String(filters.score ?? "")}
            onChange={(value) => setFilters((prev) => ({ ...prev, score: Number(value) }))}
            onReset={() => setFilters((prev) => ({ ...prev, score: null }))}
            containerWidth= {"115px"}
            firstValue="Score"
          ></CustomSelect>
        )}
        
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
        onReset={() => setFilters((prev) => ({ ...prev, genre: null }))}
        firstValue="Genres"
        ></CustomSelect>
        
      </div>
    </div>

      {isLoadingAnimes ? (
        <LoadingComponent></LoadingComponent>
      ) : !isLoadingAnimes && isErrorAnimes ? (
        <ErrorComponent text="Something went wrong" button={{ label: "Try again", action:{ type: "reload" }}}/>
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
        <ErrorComponent text="Something went wrong" button={{ label: "Try again", action:{ type: "reload" }}}/>
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
  )
}

export default DiscoverPage