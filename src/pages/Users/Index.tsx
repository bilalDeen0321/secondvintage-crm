/* eslint-disable @typescript-eslint/no-explicit-any */
import { router, usePage } from '@inertiajs/react';
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';

export default function Index() {
    const { users } = usePage().props as any;

    // No filters, no state for search or sort:
    // If you want a search input later, manage it locally and trigger router.get manually

    const columns = useMemo(() => [
        { accessorKey: 'id', header: 'ID' },
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'email', header: 'Email' },
    ], []);

    const table = useReactTable({
        data: users.data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        pageCount: users.meta?.last_page || 0,
    });

    const handlePageChange = (page: number) => {
        router.get(route('users.index'), { page }, {
            preserveState: true,
            replace: true,
        });
    };

    if (!users || !users.data) return <div>Loading...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <table className="min-w-full border border-gray-300 mb-4">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className="p-2 border">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="hover:bg-gray-100">
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="p-2 border">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-between">
                {users.links.map((link, index) => (
                    <button
                        key={index}
                        onClick={() => link.url && handlePageChange(parseInt(link.label))}
                        disabled={!link.url}
                        className={`px-3 py-1 mx-1 border rounded ${link.active ? 'bg-blue-600 text-white' : 'bg-white'}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
}
