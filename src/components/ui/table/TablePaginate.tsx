import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { router } from "@inertiajs/react";

type LaravelPaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

type TablePaginateProps = {
  links: LaravelPaginationLink[];
  className?: string;
};

const TablePaginate: React.FC<TablePaginateProps> = ({ links, className }) => {
  if (!links || links.length === 0) return null;

  // Remove « and » symbols from labels
  const parseLabel = (label: string) =>
    label.replace(/&laquo;|&raquo;/g, "").trim();

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    url: string | null
  ) => {
    e.preventDefault();
    if (!url) return;

    // Extract "page" query parameter from URL
    const pageMatch = url.match(/page=(\d+)/);
    const page = pageMatch ? parseInt(pageMatch[1]) : null;

    // ✅ Use Inertia router to go to the same route, preserving all filters/sort/search
    router.get(url, {}, { preserveScroll: true, preserveState: true });
  };

  return (
    <Pagination className={cn("mt-4", className)}>
      <PaginationContent>
        {links.map((link, index) => {
          const label = parseLabel(link.label);

          return (
            <PaginationItem key={index}>
              {link.url ? (
                <PaginationLink
                  href={link.url}
                  onClick={(e) => handleClick(e, link.url)}
                  className={cn(
                    "cursor-pointer transition-colors",
                    link.active
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "hover:bg-muted"
                  )}
                >
                  {label || index}
                </PaginationLink>
              ) : (
                <PaginationLink
                  className="pointer-events-none opacity-50"
                  aria-disabled
                >
                  {label || index}
                </PaginationLink>
              )}
            </PaginationItem>
          );
        })}
      </PaginationContent>
    </Pagination>
  );
};

export default TablePaginate;
