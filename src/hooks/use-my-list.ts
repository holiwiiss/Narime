import { useContext } from "react";
import { MyListContext } from "../context/my-list-context-value";


export function useMyAnimeList() {
  const context = useContext(MyListContext);
  if (!context) {
    throw new Error("useMyAnimeList must be used within a MyListProvider");
  }
  return context;
}
