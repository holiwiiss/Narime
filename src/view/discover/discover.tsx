import { getAnimeGenres } from "../../services/anime-genres/anime-genres"
import CustomSelect from "../../components/custom-select/custom-select"
import "./discover.scss"
import { SCORE_LIST, SORT_LIST, STATUS_LIST, TYPE_LIST, type FiltersType } from "./discover.type"
import { useDiscoverAnimes } from "./use-discover"
import { useQuery } from "@tanstack/react-query"
import AnimeGrid from "../../components/anime-grid/anime-grid"
import { useSearchParams } from "react-router-dom"

const DiscoverPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: FiltersType = {
    genre: searchParams.get("genreId") && searchParams.get("genreName")
      ? { id: Number(searchParams.get("genreId")), name: searchParams.get("genreName")! }
      : null,
    type:   searchParams.get("type"),
    score:  searchParams.get("score") ? Number(searchParams.get("score")) : null,
    order:  searchParams.get("order"),
    status: searchParams.get("status"),
    sort:   searchParams.get("sort"),
  }

  const { data: genresList = [] } = useQuery({
    queryKey: ["animeGenres"],
    queryFn: getAnimeGenres,
  })

  const {isLoadingAnimes, isErrorAnimes, discoverList, fetchNextPage, hasNextPage} = useDiscoverAnimes(filters);

  const updateFilter = (key: string, value: string | null) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value === null) {
        next.delete(key)
      } else {
        next.set(key, value)
      }
      return next
    })
  }

  return (
    <section className="discover-content-page">
      <header className="discover__header">
        <h1 className="text-h1">Discover</h1>

        <section className="discover__filters" aria-label="Anime filters">
          <CustomSelect
            options={TYPE_LIST}
            value={filters.type ?? ""}
            onChange={(value) => updateFilter("type", value)}
            onReset={() => updateFilter("type", null)}
            containerWidth= {"125px"}
            firstValue="Type"
          />

          <CustomSelect
            options={STATUS_LIST}
            value={filters.status ?? ""}
            onChange={(value) => {
              setSearchParams((prev) => {
                const next = new URLSearchParams(prev)
                next.set("status", value)
                if (value === "upcoming") next.delete("score")
                return next
              })
            }}
            onReset={() => {
              setSearchParams((prev) => {
                const next = new URLSearchParams(prev)
                next.delete("status")
                next.delete("score")
                return next
              })
            }}
            containerWidth= {"150px"}
            firstValue="Status"
          />

          <CustomSelect
            options={SORT_LIST}
            value={filters.sort ?? ""}
            onChange={(value) => updateFilter("sort", value)}
            onReset={() => updateFilter("sort", null)}
            containerWidth= {"125px"}
            firstValue="Order"
          />
        
          {filters.status !== "upcoming" && (
            <CustomSelect
              options={SCORE_LIST}
              value={String(filters.score ?? "")}
              onChange={(value) => updateFilter("score", value)}
              onReset={() => updateFilter("score", null)}
              containerWidth= {"115px"}
              firstValue="Score"
            />
          )}
          
          <CustomSelect
          options={genresList.map(genre => genre.name)}
          value={filters.genre?.name ?? ""}
          onChange={(value) => {
            const genre = genresList.find(g => g.name === value)
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev)
              if (genre) {
                next.set("genreId", String(genre.id))
                next.set("genreName", genre.name)
              }
              return next
            })
          }}
          onReset={() => {
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev)
              next.delete("genreId")
              next.delete("genreName")
              return next
            })
          }}
          firstValue="Genres"
          />
        </section>
      </header>

      <AnimeGrid
        animeList={discoverList}
        isLoading={isLoadingAnimes}
        isError={isErrorAnimes}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        fromState={{from:'/discover', label:'Discover'}}
      />

    </section>
  )
}

export default DiscoverPage