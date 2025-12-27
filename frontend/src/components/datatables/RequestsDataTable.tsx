import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { useNavigate } from "react-router";
import formatReadableDateTime from "../../utils/formateDateTime";

type Request = {
  name: string;
  _id: string;
  phone: string;
  package: {
    name: string;
  };
  trainer?: {
    name: string;
  };
  email: string;
  city: string;
  createdBy?: {
    name: string;
  };
  createdAt: string;
};

interface RequestDataTableProps {
  data: Request[];
}



const RequestDataTable: React.FC<RequestDataTableProps> = ({ data }) => {
  const navigate = useNavigate();
  const handleViewDetails = async (request: Request) => {
    navigate(`/health-dashboard/${request._id}`);
  };

  const columns: ColumnDef<Request>[] = [
    {
      accessorKey: "name",
      header: "Client",
    },
    {
      accessorKey: "trainer",
      header: "Trainer",
      cell: ({ row }) => row.original.trainer?.name || "N/A"
    },
    {
      accessorKey: "phone",
      header: "Phone Number"
    },

    {
      accessorFn: (row) => row.package?.name,
      id: "package.name",
      header: "Package",
    },
    {
      accessorKey: "createdAt",
      header: "Joined At",
      cell: ({ row }) => { return formatReadableDateTime(new Date(row.original.createdAt)) }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const request = row.original;
        return (
          <button
            onClick={() => handleViewDetails(request)}
            className="px-3 py-1 bg-brand-500 text-white rounded hover:bg-brand-600"
          >
            View Progress
          </button>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-4">
      <table className="w-full bg-white shadow-md rounded-lg">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="bg-brand-500 text-gray-200 uppercase text-sm text-center"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="py-3 px-6 text-left cursor-pointer text-center"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
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
            <tr
              key={row.id}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="py-3 px-6 text-center">
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
        <span className="text-gray-700">
          Page {table.getState().pagination.pageIndex + 1}
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

export default RequestDataTable;
