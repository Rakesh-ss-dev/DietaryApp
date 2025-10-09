import React from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
} from "@tanstack/react-table";

type Request = {
    _id: string;
    name: string;
    phone: string;
    createdBy?: {
        name: string;
    };
};

interface SelfRegisteredTableProps {
    data: Request[];
}

const SelfRegisteredTable: React.FC<SelfRegisteredTableProps> = ({ data }) => {
    const user = localStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;

    const columns = React.useMemo<ColumnDef<Request>[]>(
        () => [
            { accessorKey: "name", header: "Client" },
            { accessorKey: "phone", header: "Phone" },
            ...(parsedUser?.isSuperUser
                ? [
                    {
                        accessorFn: (row: Request) => row.createdBy?.name || "N/A",
                        id: "createdBy.name",
                        header: "Coach",
                    },
                ]
                : []),
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => {
                    const request = row.original;
                    return (
                        <a href={`client-details/${request._id}`}>
                            <button
                                className="px-3 py-1 bg-brand-500 text-white rounded hover:bg-brand-600"
                            >
                                View progress
                            </button>
                        </a>
                    );
                },
            },
        ],
        [parsedUser]
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 5 } },
    });

    return (
        <div className="p-4">
            <table className="w-full bg-white shadow-md rounded-lg">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr
                            key={headerGroup.id}
                            className="bg-brand-500 text-gray-200 uppercase text-sm"
                        >
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="py-3 px-6 text-left cursor-pointer"
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                    {header.column.getIsSorted() === "asc" && " 🔼"}
                                    {header.column.getIsSorted() === "desc" && " 🔽"}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {table.getRowModel().rows.map((row) => (
                        <tr
                            key={row.id}
                            className="border-b border-gray-200 hover:bg-gray-100"
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="py-3 px-6 text-left">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-4 py-2 bg-brand-500 text-white rounded disabled:bg-gray-300"
                >
                    Previous
                </button>
                <span>
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </span>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-4 py-2 bg-brand-500 text-white rounded disabled:bg-gray-300"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default SelfRegisteredTable;
