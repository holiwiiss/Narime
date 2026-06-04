import { useSearchParams } from "react-router-dom";
import "./search-results.scss"
import { useSearchAnimes } from "./use-search-results";
import AnimeGrid from "../../components/anime-grid/anime-grid";

const SearchResultsPage = () => {

  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const {isLoading, isError, searchList, fetchNextPage, hasNextPage} = useSearchAnimes(query ?? "")

  return (
    <main className="content-max">
      <h1 className="text-h1 search-page__title">Here are your search results...</h1>

      <AnimeGrid
        animeList={searchList}
        isLoading={isLoading}
        isError={isError}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        fromState={{from: `/search/anime?q=${query}`, label: "Search"}}
      />
    </main>
  );
};

export default SearchResultsPage;