import { useCallback } from "react"
import { useAnimeModal } from "../../hooks/use-anime-modal"
import { useMyListMap } from "../../hooks/use-my-list-map"
import type { AnimeCardType } from "../../services/anime-list/anime-list.type"
import AnimeCard from "../anime-card/anime-card"
import ErrorComponent from "../error-component/error-component"
import LoadingComponent from "../loading-component/loading-component"
import ModalAddEditAnime from "../modals/modal-add-edit"

type Props = {
  animeList: AnimeCardType[]
  isLoading: boolean
  isError: boolean
  hasNextPage?: boolean
  fetchNextPage?: () => void
  fromState: { from: string; label: string }
  variant?: "default" | "minimal" | "directory" | "upcoming" | "mylist" | "recomendations" | "discover";
  emptyState?: React.ReactNode
  emptyText?: string
}

const AnimeGrid = ({ animeList, isLoading, isError, hasNextPage, fetchNextPage, fromState, variant,emptyState, emptyText }: Props) => {
  const { getUserListData } = useMyListMap()
  const modalAddEdit = useAnimeModal()
  

  const openAddEditModal = useCallback((anime: AnimeCardType) => {
    const userData = getUserListData(anime.id)
    modalAddEdit.openModal(anime.id, anime.episodes, anime.title, userData)
  }, [getUserListData, modalAddEdit])

  if (isLoading) return <LoadingComponent />
  if (isError) return <ErrorComponent text="Something went wrong" button={{ label: "Try again", action: { type: "reload" }}} />
  if (animeList.length === 0) return emptyState ?? <ErrorComponent  text={emptyText ?? "No anime found"} />

  return (
    <>
      <ul className="cards__grid">
        {animeList.map((anime: AnimeCardType, index ) => {
          const pageSize = 25
          const indexInBatch = index % pageSize
          return(
          <AnimeCard
            key={anime.id}
            anime={anime}
            index={indexInBatch}
            userData={getUserListData(anime.id)}
            onOpenModal={() => openAddEditModal(anime)}
            fromState={fromState}
            variant={variant}
          />
          )
        })}
      </ul>
      {hasNextPage && (
        <div className="cards__load-more">
          <button className="btn" onClick={fetchNextPage}>Load more anime</button>
        </div>
      )}
      {modalAddEdit.isOpen && modalAddEdit.animeId && (
        <ModalAddEditAnime
          animeId={modalAddEdit.animeId}
          totalEpisodes={modalAddEdit.animeEpisodes}
          animeTitle={modalAddEdit.animeTitle}
          action={modalAddEdit.action}
          infoDocIdUserAnime={modalAddEdit.infoDocIdFromUser}
          onClose={modalAddEdit.closeModal}
        />
      )}
    </>
  )
}

export default AnimeGrid