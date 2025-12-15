import { useEffect, useState } from "react"
import ComponentCard from "../../components/common/ComponentCard"
import { DataTable } from "../../components/datatables/DataTable"
import axiosInstance from "../../api/axios";
import { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router";

const PackageList = () => {
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);
    const getpackages = async () => {
        const response = await axiosInstance.get("/package/list/");
        setPackages(response.data)
    }
    useEffect(() => { getpackages() }, [])
    const column: ColumnDef<any>[] = [
        {
            accessorKey: 'name',
            header: "Name",
        },
        {
            accessorKey: "price",
            header: "Price",
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const request = row.original;
                return (
                    <div className='flex gap-3 align-center justify-center'>
                        <button
                            onClick={() => { navigate(`/edit-package/${request._id}`) }}
                            className="px-3 py-1 bg-brand-500 text-white rounded hover:bg-brand-600"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => { navigate(`/delete-package/${request._id}`) }}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                            Delete
                        </button>
                    </div>
                );
            },
        }
    ];
    return (
        <ComponentCard title="Package List" createLink={'/add-package'} createTitle="Add Package">
            <DataTable columns={column} data={packages} />
        </ComponentCard>
    )
}

export default PackageList