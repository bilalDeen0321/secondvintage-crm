import { useEffect } from "react";
import { router } from "@inertiajs/react";

interface Filters {
  searchTerm: string;
  platformFilter: string;
  statusFilter: string;
  timeRange: string;
  sortField: string;
  sortDirection: "asc" | "desc";
}

export const useSalesSearch = (filters: Filters) => {
  useEffect(() => {
    if (!filters) return;

    const delay = setTimeout(() => {
      router.get(
        route("history.index"),
        {
          search: filters.searchTerm || undefined,
          platform:
            filters.platformFilter !== "All"
              ? filters.platformFilter
              : undefined,
          status:
            filters.statusFilter !== "All"
              ? filters.statusFilter
              : undefined,
          filter:
            filters.timeRange !== "all-time"
              ? filters.timeRange
              : undefined,
          sort: filters.sortField,
          dir: filters.sortDirection,
        },
        {
          preserveScroll: true,
          preserveState: true,
          replace: true,
        }
      );
    }, 400); // Debounce 400ms

    return () => clearTimeout(delay);
  }, [JSON.stringify(filters)]); // ✅ single dependency
};
