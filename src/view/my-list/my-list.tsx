import { useMemo, useState } from "react";
import type { AnimePersonalStatusType} from "../../firebase/services/firestore-service.type";
import type { AnimeCardType } from "../../services/anime-list/anime-list.type";
import { useMyListMap } from "../../hooks/use-my-list-map";
import "./my-list.scss"
import CustomSelect from "../../components/custom-select/custom-select";
import Tabs from "../../components/ui/tabs/tabs";
import IconSearch from "../../components/ui/icons/icon-search";
import AnimeGrid from "../../components/anime-grid/anime-grid";
import { useMyListOrder } from "./use-my-list-order";
import { MYLIST_TABS, ORDER_MYLIST } from "./my-list.type";
import { useMyList } from "./use-my-list";
import { useMyAnimeList } from "../../hooks/use-my-list";
import { useMyListStats } from "../../hooks/use-my-list-stats";
import ErrorComponent from "../../components/error-component/error-component";

const MyListPage = () =>{
  const { stats } = useMyListStats()
  const { myList } = useMyAnimeList()
  const {getUserListData } = useMyListMap()
  const {isLoading, isError, myAnimeList} = useMyList(myList)
  const {orderByStatus, orderByAlphabetical, orderByScore, orderByEpisodesWatched} = useMyListOrder(myAnimeList, getUserListData)
  
  const [activeCategory, setActiveCategory] = useState <"all" | AnimePersonalStatusType>("all");
  const [searchAnime, setSearchAnime] = useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = useState("");

  

  const tabsWithCount = MYLIST_TABS.map(tab => ({
  ...tab,
  count: stats[tab.value === "all" ? "total" : tab.value] as number
  }))

  const listToShow = useMemo(() => {
    let definitiveList: AnimeCardType[] = []

    if (activeCategory === "all") {
      definitiveList = orderByStatus();
    } else {
      definitiveList = myAnimeList.filter(anime => getUserListData(anime.id)?.statusPersonal === activeCategory);
    }

    if(selectedFilter === "Status") definitiveList = orderByStatus()
    if(selectedFilter === "Alphabetical") definitiveList = orderByAlphabetical()
    if(selectedFilter === "Score") definitiveList = orderByScore()
    if(selectedFilter === "Watched Episodes") definitiveList = orderByEpisodesWatched()
    
    if(searchAnime) {
      return definitiveList.filter(anime =>
        anime.title.toLowerCase().includes(searchAnime.toLowerCase())
      )
    }

    return definitiveList
  }, [myAnimeList, activeCategory, searchAnime, selectedFilter, getUserListData, orderByStatus, orderByAlphabetical, orderByScore, orderByEpisodesWatched]);

  const isEmpty =!searchAnime && listToShow.length === 0
  const isSearchEmpty = searchAnime && listToShow.length === 0

  const emptyState = isEmpty ? (
    <ErrorComponent text="Your list is empty" button={{ label: "Search Anime", action: { type: "navigate", href:"/directory" }}} />
  ) : isSearchEmpty ? (
    <ErrorComponent text={`No anime found for "${searchAnime}"`} />
  ) : undefined

return(
  <main className="content-max">
    <div className="my-list__options tab__container my-list__options-real">
      <Tabs
          options={tabsWithCount}
          activeValue={activeCategory}
          onChange={(value) => setActiveCategory(value as "all" | AnimePersonalStatusType)}
          variant="myList"
        />

      <div className="my-list__filters">

      <CustomSelect
          options={ORDER_MYLIST}
          value={selectedFilter}
          onChange={setSelectedFilter}
          onReset={() => setSelectedFilter("")}
          firstValue="Order by"
          containerWidth="225px"
        />

        <div className="action-item input">
          <IconSearch className="size-6 action-item__icon "/>
          <input type="text" className="text-p my-list__input" onInput={(event: React.InputEvent<HTMLInputElement>) => setSearchAnime(event.currentTarget.value)} placeholder="Search anime..."></input>
        </div>
      </div>
    </div>
      <AnimeGrid 
        animeList={listToShow}
        isLoading={isLoading}
        isError={isError}
        fromState={{ from: "/my-list", label: "My List" }}
        variant="mylist"
        emptyState={emptyState}
      />
  </main>
)}

export default MyListPage;