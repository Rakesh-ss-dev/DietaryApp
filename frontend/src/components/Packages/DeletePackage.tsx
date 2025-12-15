import { useNavigate, useParams } from "react-router";
import axiosInstance from "../../api/axios";
import ComponentCard from "../common/ComponentCard"
import { useEffect, useState } from "react";
import Button from "../ui/button/Button";
import toast from "react-hot-toast";

const DeletePackage = () => {
  const [pack, setPack] = useState<any>();
  const navigate = useNavigate();
  const { packageId } = useParams();
  const DeletePackage = async () => {
    try {
      await axiosInstance.delete(`package/delete/${packageId}`);
      toast.success("Package Deleted Successfully");
      navigate('/packages');
    }
    catch (err) {
      console.error(err);
    }
  }
  const getPackage = async () => {
    try {
      const response = await axiosInstance.get(`package/details/${packageId}`);
      setPack(response.data);
    }
    catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    getPackage()
  }, [packageId])
  return (
    <ComponentCard title="Delete Package">
      <div>
        <p className="text-lg mb-3">Do you really want to delete the gym with following details?</p>
        {pack && <>
          <p className="mb-2">Name: {pack.name}</p>
          <p className="mb-2">Email: {pack.price}</p>
        </>}
      </div>
      <div className="flex gap-2 align-center justify-end">
        <Button size="sm" onClick={() => { DeletePackage() }}>Delete</Button>
        <Button size="sm" onClick={() => { navigate('/packages') }} className="bg-red-500 hover:bg-red-700">Cancel</Button>
      </div>
    </ComponentCard>
  )
}

export default DeletePackage