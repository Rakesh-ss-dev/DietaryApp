import { useEffect, useState } from "react"
import Input from "../form/input/InputField"
import Label from "../form/Label"
import ComponentCard from "../common/ComponentCard";
import Button from "../ui/button/Button";
import axiosInstance from "../../api/axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";

const GYMForm = () => {
    const { gymId } = useParams();
    const navigate = useNavigate();
    const [heading, setHeading] = useState("Add New Gym");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [location, setLocation] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!gymId) {
                await axiosInstance.post("/gym/add", {
                    name,
                    email,
                    location,
                    mobile,
                    password
                });
                toast.success("Gym added successfully!");
                navigate('/gyms');
            } else {
                await axiosInstance.patch(`gym/edit/${gymId}`, {
                    name,
                    email, location, mobile
                })
                toast.success("Gym Updated successfully!");
                navigate('/gyms');
            }

        } catch (error: any) {
            console.error("Error submitting form:", error);
            toast.error(error.response?.data?.message || "An error occurred.");
        }
    }
    const getGym = async () => {
        const response = await axiosInstance.get(`gym/details/${gymId}`);
        setName(response.data.name);
        setEmail(response.data.email);
        setLocation(response.data.location);
        setMobile(response.data.mobile);
        setHeading("Edit Gym Details");
    }
    useEffect(() => {
        getGym()
    }, [gymId])
    return (
        <div className="flex align-center justify-center mt-6">
            <ComponentCard className="w-1/2" title={heading}>
                <form onSubmit={submitHandler}>
                    <div className="mb-3">
                        <Label htmlFor="gymName" >Gym Name</Label>
                        <Input required type="text" id="gymName" value={name} onChange={(e) => setName(e.target.value)} name="name" placeholder="Enter Gym Name" />
                    </div>
                    <div className="mb-3">
                        <Label htmlFor="ownerEmail" >Owner's Email</Label>
                        <Input required type="email" id="ownerEmail" value={email} onChange={(e) => setEmail(e.target.value)} name="ownerEmail" placeholder="Enter Owner's Email" />
                    </div>
                    <div className="mb-3">
                        <Label htmlFor="location" >Location</Label>
                        <Input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} name="location" placeholder="Enter Gym Location" />
                    </div>
                    <div className="mb-3">
                        <Label htmlFor="contactNumber" >Contact Number</Label>
                        <Input required type="tel" id="contactNumber" value={mobile} onChange={(e) => setMobile(e.target.value)} name="contactNumber" placeholder="Enter Contact Number" />
                    </div>

                    {gymId ? "" : <div className="mb-3">
                        <Label htmlFor="password" >Password</Label>
                        <Input required type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" placeholder="Enter Password" />
                    </div>}
                    <Button type="submit">Submit</Button>
                </form>
            </ComponentCard>
        </div>
    )
}

export default GYMForm