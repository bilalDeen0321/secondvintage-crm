import { useEffect, useRef } from "react";
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
  const prevFilters = useRef<Filters | null>(null);

  useEffect(() => {
    // Compare shallowly — only trigger when actual values change
    const hasChanged =
      !prevFilters.current ||
      Object.keys(filters).some(
        (key) =>
          (filters as any)[key] !== (prevFilters.current as any)[key]
      );

    if (!hasChanged) return;
    prevFilters.current = filters;

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
    }, 400);

    return () => clearTimeout(delay);
  }, [filters]);
};
