import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios"
import ComponentCard from "../../components/common/ComponentCard"
import { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router";
import { DataTable } from "../../components/datatables/DataTable";
import formatReadableDateTime from "../../utils/formateDateTime";
interface Trainer {
    _id: string,
    name: String,
    email: string,
    mobile: string,
    location: string,
    assignedTo: any,
    clientNumber: number,
    createdAt: string,
}
const TrainerList = () => {
    const navigate = useNavigate();
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log(user);
    const getTrainers = async () => {
        const response = await axiosInstance.get('trainer/list');
        setTrainers(response.data);
    }
    useEffect(() => {
        getTrainers();
    }, [])
    const column: ColumnDef<Trainer>[] = [
        {
            accessorKey: 'name',
            header: "Name",
        },
        {
            accessorKey: 'mobile',
            header: "Mobile"
        },
        {
            accessorKey: "assignedTo",
            header: "Assigned To",
            cell: ({ row }) => row.original.assignedTo?.name
        },
        {
            accessorKey: "clientNumber",
            header: "Number of Clients",
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
                    <div className='flex gap-3 align-center justify-center'>
                        <button
                            onClick={() => { navigate(`/edit-Trainer/${request._id}`) }}
                            className="px-3 py-1 bg-brand-500 text-white rounded hover:bg-brand-600"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => { navigate(`/delete-Trainer/${request._id}`) }}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                            Delete
                        </button>
                    </div>
                );
            },
        },
    ]
    if (!user.isSuperUser) {
        column.splice(2, 1);
    }
    return (
        <ComponentCard title="Trainers List" createLink={'/add-trainer'} createTitle="Add Trainer" >
            <DataTable columns={column} data={trainers} />
        </ComponentCard>
    )
}
export default TrainerList