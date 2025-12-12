import { useNavigate, useParams } from "react-router";
import axiosInstance from "../../api/axios";
import ComponentCard from "../common/ComponentCard"
import { useEffect, useState } from "react";
import Button from "../ui/button/Button";
import toast from "react-hot-toast";

const DeleteTrainer = () => {
    const [trainer, setTrainer] = useState<any>();
    const navigate = useNavigate();
    const { trainerId } = useParams();
    const deleteTrainer = async () => {
        try {
            await axiosInstance.delete(`trainer/delete/${trainerId}`);
            toast.success("Trainer Deleted Successfully");
            navigate('/trainers');
        }
        catch (err) {
            console.error(err);
        }
    }
    const getTrainer = async () => {
        try {
            const response = await axiosInstance.get(`trainer/details/${trainerId}`);
            setTrainer(response.data);

        }
        catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        getTrainer()
    }, [trainerId])
    return (
        <ComponentCard title="Delete Gym">
            <div>
                <p className="text-lg mb-3">Do you really want to delete the gym with following details?</p>
                {trainer && <>
                    <p className="mb-2">Name: {trainer.name}</p>
                    <p className="mb-2">Email: {trainer.email}</p>
                    <p className="mb-2">mobile: {trainer.mobile}</p>
                    <p className="mb-2">Assigned To: {trainer?.assignedTo?.name}</p>
                </>}
            </div>
            <div className="flex gap-2 align-center justify-end">
                <Button size="sm" onClick={() => { deleteTrainer() }}>Delete</Button>
                <Button size="sm" onClick={() => { navigate('/trainers') }} className="bg-red-500 hover:bg-red-700">Cancel</Button>
            </div>
        </ComponentCard>
    )
}

export default DeleteTrainer