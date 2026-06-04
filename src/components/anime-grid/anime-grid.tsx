import { useAnimeModal } from "../../hooks/useAnimeModal"
import { useMyListMap } from "../../hooks/useMyListMap"
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
  variant?: "default" | "minimal" | "directory" | "upcoming" | "mylist" | "recomendations";
}

const AnimeGrid = ({ animeList, isLoading, isError, hasNextPage, fetchNextPage, fromState, variant }: Props) => {
  const { getUserListData } = useMyListMap()
  const modalAddEdit = useAnimeModal()

  const openAddEditModal = (anime: AnimeCardType) => {
    const userData = getUserListData(anime.id)
    modalAddEdit.openModal(anime.id, anime.episodes, anime.title, userData)
  }

  if (isLoading) return <LoadingComponent />
  if (isError) return <ErrorComponent text="Something went wrong" button={{ label: "Try again", action: { type: "reload" }}} />
  if (animeList.length === 0) return <ErrorComponent text="Something went wrong" />

  return (
    <>
      <ul className="cards__grid">
        {animeList.map((anime: AnimeCardType) => (
          <AnimeCard
            key={anime.id}
            anime={anime}
            userData={getUserListData(anime.id)}
            onOpenModal={() => openAddEditModal(anime)}
            fromState={fromState}
            variant={variant}
          />
        ))}
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