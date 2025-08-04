import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";

type LaravelPaginationLink = {
    url: string | null;
    label: string; // e.g. "&laquo; Previous", "1", "2", "Next &raquo;"
    active: boolean;
};

type TablePaginateProps = {
    links: LaravelPaginationLink[];
};

/**
 * TablePaginate
 * Renders pagination UI from Laravel's `meta.links` array
 * using your Pagination component styles.
 *
 * Uses <a href="..."> links that Inertia will intercept.
 */
const TablePaginate: React.FC<TablePaginateProps> = ({ links }) => {
    if (!links || links.length === 0) return null;

    return (
        <Pagination className="mt-4">
            <PaginationContent>
                {links.map((link, index) => {
                    // Normalize label to lowercase string for checks
                    const labelStr = String(link.label).toLowerCase().trim();

                    // Detect types of links
                    const isPrevious =
                        labelStr.includes("previous") ||
                        labelStr.includes("«") ||
                        labelStr.includes("&laquo;");
                    const isNext =
                        labelStr.includes("next") ||
                        labelStr.includes("»") ||
                        labelStr.includes("&raquo;");
                    const isEllipsis = labelStr === "...";

                    if (isEllipsis) {
                        return (
                            <PaginationItem key={index}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }

                    if (isPrevious) {
                        return (
                            <PaginationItem key={index}>
                                <PaginationPrevious
                                    href={link.url ?? "#"}
                                    className={
                                        !link.url
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                    }
                                    aria-disabled={!link.url}
                                />
                            </PaginationItem>
                        );
                    }

                    if (isNext) {
                        return (
                            <PaginationItem key={index}>
                                <PaginationNext
                                    href={link.url ?? "#"}
                                    className={
                                        !link.url
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                    }
                                    aria-disabled={!link.url}
                                />
                            </PaginationItem>
                        );
                    }

                    // Regular page number link
                    return (
                        <PaginationItem key={index}>
                            <PaginationLink
                                href={link.url ?? "#"}
                                isActive={link.active}
                                className={
                                    !link.url
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }
                                aria-current={link.active ? "page" : undefined}
                            >
                                {/* Render label as raw HTML to support Laravel's encoded entities */}
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
            </PaginationContent>
        </Pagination>
    );
};

export default TablePaginate;
