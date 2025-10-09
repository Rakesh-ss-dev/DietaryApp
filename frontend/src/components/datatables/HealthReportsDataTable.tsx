import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  CellContext,
} from "@tanstack/react-table";
import { Modal } from "../ui/modal";

type HealthReport = {
  date: string;
  height: number;
  weight: number;
  bmi: number;
  bmiStatus: string;
  vitamins: {
    vitaminD: number;
    vitaminB12: number;
    iron: number;
  };
  diabetesAndLipidProfile: {
    hba1c: number;
    triglycerides: number;
    hdl: number;
  };
  thyroidAndUricAcid: {
    tsh: number;
    uricAcid: number;
  };
};

interface HealthReportsDataTableProps {
  data: HealthReport[];
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const HealthReportsDataTable: React.FC<HealthReportsDataTableProps> = ({ data }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<HealthReport | null>(null);

  const handleView = (report: HealthReport) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  const columns: ColumnDef<HealthReport>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: (info: CellContext<HealthReport, any>) => formatDate(info.getValue()),
    },
    { accessorKey: "height", header: "Height (cm)" },
    { accessorKey: "weight", header: "Weight (kg)" },
    { accessorKey: "bmi", header: "BMI" },
    { accessorKey: "bmiStatus", header: "BMI Status" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <button
          onClick={() => handleView(row.original)}
          className="px-3 py-1 bg-brand-500 text-white rounded hover:bg-brand-600"
        >
          View Details
        </button>
      ),
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
      <table className="w-full bg-white shadow rounded-lg">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-brand-500 text-white text-sm uppercase">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 text-left">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="text-gray-700 text-sm">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for full details */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} className="max-w-2xl p-4">
        {selectedReport && (
          <div className="text-gray-800 dark:text-white space-y-4">
            <h2 className="text-lg font-bold">Health Report – {formatDate(selectedReport.date)}</h2>

            <div>
              <h3 className="font-semibold text-brand-500">Vitamins</h3>
              <ul className="ml-4 list-disc">
                <li>Vitamin D: {selectedReport.vitamins.vitaminD} ng/mL</li>
                <li>Vitamin B12: {selectedReport.vitamins.vitaminB12} pg/mL</li>
                <li>Iron: {selectedReport.vitamins.iron} ng/mL</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-brand-500">Diabetes & Lipids</h3>
              <ul className="ml-4 list-disc">
                <li>HbA1c: {selectedReport.diabetesAndLipidProfile.hba1c}%</li>
                <li>Triglycerides: {selectedReport.diabetesAndLipidProfile.triglycerides} mg/dL</li>
                <li>HDL: {selectedReport.diabetesAndLipidProfile.hdl} mg/dL</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-brand-500">Thyroid & Uric Acid</h3>
              <ul className="ml-4 list-disc">
                <li>TSH: {selectedReport.thyroidAndUricAcid.tsh} µIU/mL</li>
                <li>Uric Acid: {selectedReport.thyroidAndUricAcid.uricAcid} mg/dL</li>
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HealthReportsDataTable;
