import type { PaginationType } from "./anime-pagination.type";
import type { JikanPaginationType } from "./jikan-API.type";

export function mapJikanAnimePagination(pagination: JikanPaginationType) :  PaginationType{
  return {
    lastVisiblePage: pagination.last_visible_page,
    hasNextPage: pagination.has_next_page,
    currentPage: pagination.current_page,
    totalItems: pagination.items.total,
  }
}