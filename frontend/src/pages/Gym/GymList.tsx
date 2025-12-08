
import { useEffect, useState } from 'react'
import ComponentCard from '../../components/common/ComponentCard'
import axiosInstance from '../../api/axios';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../components/datatables/DataTable';
import { useNavigate } from 'react-router';
interface Gym {
    _id: string,
    name: String,
    email: string,
    mobile: string,
    location: string,
}
const GymList = () => {
    const navigate = useNavigate();
    const [gyms, setGyms] = useState<Gym[]>([]);
    const getGyms = async () => {
        const response = await axiosInstance.get(`gym/list`);
        setGyms(response.data);
    }
    const column: ColumnDef<Gym>[] = [
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
                            onClick={() => { navigate(`/edit-Gym/${request._id}`) }}
                            className="px-3 py-1 bg-brand-500 text-white rounded hover:bg-brand-600"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => { navigate(`/delete-Gym/${request._id}`) }}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                            Delete
                        </button>
                    </div>
                );
            },
        },
    ]
    useEffect(() => {
        getGyms();
    }, [])
    return (
        <ComponentCard title="Gyms List" createLink={'/add-gym'} createTitle='Add Gym'>
            <DataTable columns={column} data={gyms} />
        </ComponentCard>
    )
}

export default GymList