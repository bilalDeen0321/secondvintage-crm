import TablePaginate from "./TablePaginate";

type LaravelPaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type LaravelPaginationMeta = {
    current_page: number;
    from: number | null;
    to: number | null;
    total: number;
    per_page: number;
    links: LaravelPaginationLink[];
};

type TablePaginateProps = {
    meta: LaravelPaginationMeta;
};

const LaravelPaginate = ({ meta }: TablePaginateProps) => {
    return (
        <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-slate-600">
                Showing {meta.from ?? 0}-{meta.to ?? 0} of {meta.total} watches
            </div>
            <TablePaginate links={meta.links} />
        </div>
    );
};


export default LaravelPaginate;