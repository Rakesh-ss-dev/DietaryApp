import { useNavigate, useParams } from "react-router";
import axiosInstance from "../../api/axios";
import ComponentCard from "../common/ComponentCard"
import { useEffect, useState } from "react";
import Button from "../ui/button/Button";
import toast from "react-hot-toast";

const DeleteGym = () => {
    const [gym, setGym] = useState<any>();
    const navigate = useNavigate();
    const { gymId } = useParams();
    const deleteGym = async () => {
        try {
            await axiosInstance.delete(`gym/delete/${gymId}`);
            toast.success("Gym Deleted Successfully");
            navigate('/gyms');
        }
        catch (err) {
            console.error(err);
        }
    }
    const getGym = async () => {
        try {
            const response = await axiosInstance.get(`gym/details/${gymId}`);
            setGym(response.data);

        }
        catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        getGym()
    }, [gymId])
    return (
        <ComponentCard title="Delete Gym">
            <div>
                <p className="text-lg mb-3">Do you really want to delete the gym with following details?</p>
                {gym && <>
                    <p className="mb-2">Name: {gym.name}</p>
                    <p className="mb-2">Email: {gym.email}</p>
                    <p className="mb-2">mobile: {gym.mobile}</p>
                    <p className="mb-2">location: {gym.location}</p>
                </>}
            </div>
            <div className="flex gap-2 align-center justify-end">
                <Button size="sm" onClick={() => { deleteGym() }}>Delete</Button>
                <Button size="sm" onClick={() => { navigate('/gyms') }} className="bg-red-500 hover:bg-red-700">Cancel</Button>
            </div>
        </ComponentCard>
    )
}

export default DeleteGym