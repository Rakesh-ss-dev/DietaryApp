import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  CellContext,
  ColumnDef,
} from "@tanstack/react-table";
import axios from "axios";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";

type Request = {
  name: string;
  phone: string;
  package: {
    name: string;
  };
  payed_at: string;
  createdBy?: {
    name: string;
  };
};

interface RequestDataTableProps {
  data: Request[];
}

const formatReadableDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const RequestDataTable: React.FC<RequestDataTableProps> = ({ data }) => {
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;
  const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
  const { isOpen, openModal, closeModal } = useModal();
  const [requestDetails, setRequestDetails] = useState<any>({});

  const handleViewDetails = async (request: Request) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${SERVER_URL}/payment/getPaymentDetails`,
      {
        request,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setRequestDetails(res.data.request);
    openModal();
  };

  const columns: ColumnDef<Request>[] = [
    {
      accessorKey: "name",
      header: "Client",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorFn: (row) => row.package?.name,
      id: "package.name",
      header: "Package",
    },
    {
      accessorKey: "payed_at",
      header: "Date",
      cell: (info: CellContext<Request, any | undefined>) =>
        formatReadableDate(info.getValue() || ""),
    },
    ...(parsedUser?.isSuperUser
      ? [
        {
          accessorFn: (row: any) => row.createdBy?.name || "N/A",
          id: "createdBy.name",
          header: "Created By",
        },
      ]
      : []),
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
            View Details
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
    initialState: {
      sorting: [
        {
          id: "payed_at", // Match accessorKey
          desc: true,
        },
      ],
    },
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
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
          <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
            Request Details
          </h4>
          {requestDetails.name && (
            <Table>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                <TableRow>
                  <TableCell className="px-4 py-3 sm:px-6 text-start">
                    Client Name
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {requestDetails.name}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="px-4 py-3 sm:px-6 text-start">
                    Phone
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {requestDetails.phone}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="px-4 py-3 sm:px-6 text-start">
                    Package
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {requestDetails.package.name}
                  </TableCell>
                </TableRow>

                {requestDetails.discount > 0 && <TableRow>
                  <TableCell className="px-4 py-3 sm:px-6 text-start">
                    Discount
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {requestDetails.discount}%
                  </TableCell>
                </TableRow>}
                <TableRow>
                  <TableCell className="px-4 py-3 sm:px-6 text-start">
                    Amount Paid
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {requestDetails.amount}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="px-4 py-3 sm:px-6 text-start">
                    Payment Link
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {requestDetails.url}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="px-4 py-3 sm:px-6 text-start">
                    Status
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {requestDetails.status}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="px-4 py-3 sm:px-6 text-start">
                    Installment
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {requestDetails.installment == ""
                      ? "Full Payment"
                      : requestDetails.installment}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="px-4 py-3 sm:px-6 text-start">
                    Date
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {formatReadableDate(requestDetails.payed_at)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default RequestDataTable;
