import "./directory.scss";
import { useSearchParams } from "react-router-dom";
import { DIRECTORY_TABS, type CategoryType } from "./directory.type";
import ForYou from "../../components/for-you/for-you";
import { useDirectoryAnimes } from "./use-directory";
import Tabs from "../../components/ui/tabs/tabs";
import AnimeGrid from "../../components/anime-grid/anime-grid";

const DirectoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = (searchParams.get("category") as CategoryType) ?? "top";

  const {isLoading, isError, animeList, fetchNextPage, hasNextPage} = useDirectoryAnimes(category)

  return (
    <section className="content-max" aria-labelledby="directory-title">
      <h1 id="directory-title" className="visually-hidden">Directory Anime</h1> 
      <nav className="my-list__options tab__container" aria-label="Category filters">
        <Tabs
          options={DIRECTORY_TABS}
          activeValue={category}
          onChange={(value) => setSearchParams({ category: value as CategoryType })}
        />
      </nav>
      {category === "para ti" ? (
        <ForYou />
      ) : (
        <AnimeGrid
          animeList={animeList}
          isLoading={isLoading}
          isError={isError}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          fromState={{from: "/directory", label: "Directory" }}
          variant={category === 'upcoming' ? "upcoming" : "directory"}
        />
      )}
    </section>
  );
};

export default DirectoryPage;