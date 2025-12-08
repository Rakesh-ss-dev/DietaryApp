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
    const getGyms = async () => {
        const response = await axiosInstance.get(`gym/list`);
        const formatedGyms = response.data.map((gym: any) => ({ value: gym._id, label: gym.name }));
        setGyms(formatedGyms);
    }
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
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
        catch (err) {
            console.error(err);
        }
    }
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
                            <Label htmlFor="trainerEmail" >Owner's Email</Label>
                            <Input required type="email" id="trainerEmail" value={email} onChange={(e) => setEmail(e.target.value)} name="ownerEmail" placeholder="Enter Trainer's Email" />
                        </div>
                        <div className="mb-3">
                            <Label htmlFor="contactNumber" >Contact Number</Label>
                            <Input required type="tel" id="contactNumber" value={mobile} onChange={(e) => setMobile(e.target.value)} name="contactNumber" placeholder="Enter Contact Number" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Assignedto">Assigned To</label>
                            <Select options={gyms} onChange={(gym: any) => setSelectedGym(gym)} />
                        </div>
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