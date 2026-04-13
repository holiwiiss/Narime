import type { PaginationType } from "../types/api/animePaginationTyping";
import type { JikanPaginationType } from "../types/api/JikanAPITyping";

export function mapJikanAnimePagination(pagination: JikanPaginationType) :  PaginationType{
  return {
    last_visible_page: pagination.last_visible_page,
    has_next_page: pagination.has_next_page,
    current_page: pagination.current_page,
    total_items: pagination.items.total,
  }
}