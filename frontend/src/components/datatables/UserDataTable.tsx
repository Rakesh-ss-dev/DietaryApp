import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";

// Define User type
type User = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
};

// Define component props
interface UserDataTableProps {
  data: User[];
}

const UserDataTable: React.FC<UserDataTableProps> = ({ data }) => {
  // Define table columns
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "mobile",
      header: "Mobile",
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "name", desc: false },
  ]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-4">
      <table className="w-full bg-white shadow-md rounded-lg">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-brand-500 text-gray-200 uppercase text-sm">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="py-3 px-6 text-left cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted()
                    ? header.column.getIsSorted() === "desc"
                      ? " 🔽"
                      : " 🔼"
                    : ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-100">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="py-3 px-6 text-left">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-brand-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="text-gray-700">Page {table.getState().pagination.pageIndex + 1}</span>
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

export default UserDataTable;
