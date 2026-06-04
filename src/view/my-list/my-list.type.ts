import type { AnimePersonalStatusType } from "../../firebase/services/firestore-service.type";

export const MYLIST_TABS: { value: "all" | AnimePersonalStatusType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "watching", label: "Watching" },
  { value: "completed", label: "Completed" },
  { value: "dropped", label: "Dropped" },
  { value: "planToWatch", label: "Plan To Watch" },
]

export const ORDER_MYLIST= ["Status", "Alphabetical", "Score", "Watched Episodes", "Last Updated"]
