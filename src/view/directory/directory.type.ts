export type DirectoryCategoryType = "top" | "trending" | "seasonal" | "upcoming";
export type CategoryType = DirectoryCategoryType | "para ti";

export const DIRECTORY_TABS: { value: CategoryType; label: string }[] = [
  { value: "para ti", label: "For You" },
  { value: "top", label: "Top anime" },
  { value: "trending", label: "Trending" },
  { value: "seasonal", label: "Seasonal" },
  { value: "upcoming", label: "Upcoming" },
]