import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios"
import ComponentCard from "../../components/common/ComponentCard"
import { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router";
import { DataTable } from "../../components/datatables/DataTable";
interface Trainer {
    _id: string,
    name: String,
    email: string,
    mobile: string,
    location: string,
    assignedTo: any
}
const TrainerList = () => {
    const navigate = useNavigate();
    const [trainers, setTrainers] = useState<Trainer[]>([]);
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
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: 'mobile',
            header: "Mobile"
        },
        {
            accessorKey: "location",
            header: "Location"
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
    return (
        <ComponentCard title="Trainers List" createLink={'/add-trainer'} createTitle="Add Trainer" >
            <DataTable columns={column} data={trainers} />
        </ComponentCard>
    )
}
export default TrainerList