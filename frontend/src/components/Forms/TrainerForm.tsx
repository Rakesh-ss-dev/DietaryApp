import { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard"
import Input from "../form/input/InputField"
import Label from "../form/Label"
import { useNavigate, useParams } from "react-router";
import Button from "../ui/button/Button";
import axiosInstance from "../../api/axios";
import Select from "../form/Select";
import toast from "react-hot-toast";

const TrainerForm = () => {
    const navigate = useNavigate();
    const { trainerId } = useParams();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [gyms, setGyms] = useState<any[]>([]);
    const [selectedGym, setSelectedGym] = useState();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const getGyms = async () => {
        const response = await axiosInstance.get(`gym/list`);
        const formatedGyms = response.data.map((gym: any) => ({ value: gym._id, label: gym.name }));
        setGyms(formatedGyms);
    }
    const getTrainer = async () => {
        const response = await axiosInstance.get(`trainer/details/${trainerId}`);
        const trainer = response.data;
        setName(trainer.name);
        setEmail(trainer.email);
        setMobile(trainer.mobile);
        setSelectedGym(trainer.assignedTo._id);
    }
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            if (!trainerId) {
                await axiosInstance.post("/trainer/add", {
                    name,
                    email,
                    password,
                    mobile,
                    assignedTo: selectedGym
                })
                toast.success("Trainer Added Successfully");
                navigate('/trainers');
            }
            else {
                await axiosInstance.patch(`/trainer/edit/${trainerId}`, {
                    name,
                    email, mobile,
                    assignedTo: selectedGym
                });
                toast.success("Trainer Updated Successfully");
                navigate('/trainers');
            }
        }
        catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        getTrainer();
    }, [trainerId])
    useEffect(() => {
        getGyms();
    }, [])
    return (
        <div className="flex align-center justify-center mt-6">
            <ComponentCard className="w-1/2" title="Add Trainer">
                <form onSubmit={handleSubmit} >
                    <div className="grid ">
                        <div className="mb-3">
                            <Label htmlFor="trianerName" >Trainer Name</Label>
                            <Input required type="text" id="trainerName" value={name} onChange={(e) => setName(e.target.value)} name="name" placeholder="Enter Trainer Name" />
                        </div>
                        <div className="mb-3">
                            <Label htmlFor="trainerEmail" >Email</Label>
                            <Input required type="email" id="trainerEmail" value={email} onChange={(e) => setEmail(e.target.value)} name="ownerEmail" placeholder="Enter Trainer's Email" />
                        </div>
                        <div className="mb-3">
                            <Label htmlFor="contactNumber" >Contact Number</Label>
                            <Input required type="tel" id="contactNumber" value={mobile} onChange={(e) => setMobile(e.target.value)} name="contactNumber" placeholder="Enter Contact Number" />
                        </div>
                        {user.accessModule === "Gym" ? null : (
                            <div className="mb-3">
                                <Label htmlFor="Assignedto">Assigned To</Label>
                                <Select options={gyms} defaultValue={selectedGym} onChange={(gym: any) => setSelectedGym(gym)} />
                            </div>)}
                        {trainerId ? "" : <div className="mb-3">
                            <Label htmlFor="password" >Password</Label>
                            <Input required type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" placeholder="Enter Password" />
                        </div>}
                    </div>
                    <Button type="submit">Submit</Button>
                </form>
            </ComponentCard>
        </div>
    )
}

export default TrainerForm