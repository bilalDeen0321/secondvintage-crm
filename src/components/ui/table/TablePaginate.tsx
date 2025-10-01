import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import React from "react";

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

  // Extract Laravel structure
  const previous = links[0];
  const next = links[links.length - 1];
  const pageLinks = links.slice(1, -1); // just the middle (numbers + ellipsis)

  // Find current page
  const currentPage = pageLinks.find((l) => l.active);
  const current = currentPage ? parseInt(currentPage.label) : 1;

  // Find last page
  const last = parseInt(pageLinks[pageLinks.length - 1].label);

  const windowSize = 7;
  let start = Math.max(1, current - Math.floor(windowSize / 2));
  let end = start + windowSize - 1;
  if (end > last) {
    end = last;
    start = Math.max(1, end - windowSize + 1);
  }

  const pages: number[] = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <Pagination className={cn("mt-4", className)}>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            href={previous.url ?? "#"}
            className={!previous.url ? "pointer-events-none opacity-50" : ""}
            aria-disabled={!previous.url}
          />
        </PaginationItem>

        {/* First page + ellipsis if needed */}
        {start > 1 && (
          <>
            <PaginationItem>
              <PaginationLink href={links.find((l) => l.label === "1")?.url ?? "#"}>
                1
              </PaginationLink>
            </PaginationItem>
            {start > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {/* Sliding window */}
        {pages.map((page) => {
          const link = pageLinks.find((l) => l.label === String(page));
          return (
            <PaginationItem key={page}>
              <PaginationLink
                href={link?.url ?? "#"}
                isActive={page === current}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Last page + ellipsis if needed */}
        {end < last && (
          <>
            {end < last - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink href={links.find((l) => l.label === String(last))?.url ?? "#"}>
                {last}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            href={next.url ?? "#"}
            className={!next.url ? "pointer-events-none opacity-50" : ""}
            aria-disabled={!next.url}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TablePaginate;
