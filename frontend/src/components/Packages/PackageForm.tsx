import { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard"
import Input from "../form/input/InputField"
import Label from "../form/Label"
import Button from "../ui/button/Button";
import { useNavigate, useParams } from "react-router";
import axiosInstance from "../../api/axios";
import toast from "react-hot-toast";

const PackageForm = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const navigate = useNavigate();
    const { packageId } = useParams();
    const getPackage = async () => {
        const response = await axiosInstance.get(`/package/details/${packageId}`);
        setName(response.data.name);
        setPrice(response.data.price);
    }
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            if (packageId) {
                await axiosInstance.patch(`package/edit/${packageId}`, {
                    name,
                    price
                })
                toast.success("Package Updated successfully!");
                navigate('/packages');
            }
            else {
                await axiosInstance.post(`package/add/`, {
                    name,
                    price
                })
                toast.success("Package Added successfully!");
                navigate('/packages');
            }
        }
        catch (e) {
            console.error(e)
        }
    }
    useEffect(() => {
        getPackage();
    }, [packageId])
    return (
        <ComponentCard className="w-1/2" title="Create Package">
            <form onSubmit={handleSubmit} >
                <div className="mb-3">
                    <Label>Name</Label>
                    <Input value={name} onChange={(e) => { setName(e.target.value) }} type="text" required />
                </div>
                <div className="mb-3">
                    <Label>Price</Label>
                    <Input value={price} onChange={(e) => { setPrice(e.target.value) }} type="number" required />
                </div>
                <div className="flex justify-end gap-3">
                    <Button>Submit</Button>
                    <Button onClick={() => { navigate('/packages') }} className="bg-red-500 hover:bg-red-800">Cancel</Button>
                </div>
            </form>
        </ComponentCard>
    )
}

export default PackageForm