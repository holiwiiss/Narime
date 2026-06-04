import { useState } from "react"
import { getAnimeGenres } from "../../services/anime-genres/anime-genres"
import CustomSelect from "../../components/custom-select/custom-select"
import "./discover.scss"
import { SCORE_LIST, SORT_LIST, STATUS_LIST, TYPE_LIST, type FiltersType } from "./discover.type"
import { useDiscoverAnimes } from "./use-discover"
import { useQuery } from "@tanstack/react-query"
import AnimeGrid from "../../components/anime-grid/anime-grid"

const DiscoverPage = () => {

  const [filters, setFilters] = useState<FiltersType>({
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

  const {isLoadingAnimes, isErrorAnimes, discoverList, fetchNextPage, hasNextPage} = useDiscoverAnimes(filters);

  return (
    <main className="content-max">
      <header className="discover__header">
        <h1 className="text-h1">Discover</h1>

        <section className="discover__filters" aria-label="Anime filters">
          <CustomSelect
            options={TYPE_LIST}
            value={filters.type ?? ""}
            onChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}
            onReset={() => setFilters((prev) => ({ ...prev, type: null }))}
            containerWidth= {"125px"}
            firstValue="Type"
          />

          <CustomSelect
            options={STATUS_LIST}
            value={filters.status ?? ""}
            onChange={(value) =>setFilters((prev) => ({
              ...prev,
              status: value,
              score: value === "upcoming" ? 0 : null
            }))}
            onReset={() => setFilters((prev) => ({ ...prev, status: null, score: null }))}
            containerWidth= {"150px"}
            firstValue="Status"
          />

          <CustomSelect
            options={SORT_LIST}
            value={filters.sort ?? ""}
            onChange={(value) => setFilters((prev) => ({ ...prev, sort: value }))}
            onReset={() => setFilters((prev) => ({ ...prev, sort: null }))}
            containerWidth= {"125px"}
            firstValue="Order"
          />
        
          {filters.status !== "upcoming" && (
            <CustomSelect
              options={SCORE_LIST}
              value={String(filters.score ?? "")}
              onChange={(value) => setFilters((prev) => ({ ...prev, score: Number(value) }))}
              onReset={() => setFilters((prev) => ({ ...prev, score: null }))}
              containerWidth= {"115px"}
              firstValue="Score"
            />
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

    </main>
  )
}

export default DiscoverPage